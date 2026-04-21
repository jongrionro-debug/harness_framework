from __future__ import annotations

import json
import re
import shutil
import tempfile
from dataclasses import dataclass
from pathlib import Path
from time import sleep, time

from playwright.sync_api import Error, Page, sync_playwright


ROOT = Path(__file__).resolve().parent.parent
HANDOFF_DIR = ROOT / "stitch-handoff"
SCREENS_DIR = HANDOFF_DIR / "07-current-ui-screens"
BASE_URL = "http://127.0.0.1:3001"


@dataclass
class CaptureItem:
    filename: str
    route: str
    state: str
    note: str


def ensure_clean_output_dir() -> None:
    SCREENS_DIR.mkdir(parents=True, exist_ok=True)
    for existing in SCREENS_DIR.glob("*.png"):
        existing.unlink()


def wait_for_idle() -> None:
    sleep(0.8)


def capture(page: Page, item: CaptureItem) -> None:
    wait_for_idle()
    page.screenshot(path=str(SCREENS_DIR / item.filename), full_page=True)


def copy_reference_docs() -> None:
    docs_to_copy = {
        ROOT / "docs" / "SYSTEM_REPORT.md": HANDOFF_DIR / "03-system-report.md",
        ROOT / "docs" / "UI_GUIDE.md": HANDOFF_DIR / "05-ui-guide.md",
        ROOT / "docs" / "STITCH_PROMPT.md": HANDOFF_DIR / "08-stitch-prompt.md",
        ROOT / "docs" / "STITCH_HANDOFF_CHECKLIST.md": HANDOFF_DIR / "09-stitch-handoff-checklist.md",
        ROOT / "docs" / "STITCH_SCREENSHOT_PLAN.md": HANDOFF_DIR / "10-stitch-screenshot-plan.md",
    }

    prd_excerpt = HANDOFF_DIR / "04-prd-excerpt.md"
    prd_text = (ROOT / "docs" / "PRD.md").read_text(encoding="utf-8")
    excerpt = prd_text.split("## 핵심 사용자", 1)[0]
    excerpt += "## 핵심 사용자\n"
    excerpt += prd_text.split("## 핵심 사용자", 1)[1].split("## 핵심 도메인 정의", 1)[0]
    prd_excerpt.write_text(excerpt, encoding="utf-8")

    for source, target in docs_to_copy.items():
        shutil.copyfile(source, target)


def write_bundle_docs() -> None:
    (HANDOFF_DIR / "01-product-summary.md").write_text(
        """# Product Summary

## One-line summary

`harness_framework` is a local-first web MVP for education program operations, where organization admins set up programs and sessions, and teachers submit attendance, lesson journals, and attachments for their assigned sessions.

## Core users

- Organization admin
  - creates the organization
  - configures villages, programs, classes, participants
  - invites and approves teachers
  - assigns teachers to classes
  - creates sessions
  - reviews records in the dashboard and records browser
- Teacher
  - sees only assigned sessions
  - records attendance
  - writes a lesson journal
  - uploads attachments
  - submits and later edits the same session record

## Important product rules

- This is not a generic SaaS dashboard. It should feel like a warm, messenger-like operations tool.
- Admin and teacher flows are separated by role after the same authentication flow.
- The key record unit is one class session on one date.
- Sessions are created by admins first, then filled by teachers.
- Session participant snapshots are frozen at session creation time.
- `submitted_at` is preserved as the first submission time, and `updated_at` reflects later edits.
""",
        encoding="utf-8",
    )

    (HANDOFF_DIR / "02-redesign-goals.md").write_text(
        """# Redesign Goals

## What should stay

- The role split between operator and teacher experiences
- The warm messenger-like tone
- The yellow accent brand direction
- The existing product structure and workflow boundaries

## What should improve

- Clearer information hierarchy on the operator dashboard
- Faster and shorter teacher session input flow
- Better scanability for records browsing and record detail
- Less repetitive card structure across all screens
- Stronger state communication for pending, submitted, updated, and empty states

## Priority screens

1. `/dashboard`
2. `/sessions/[sessionId]`
3. `/records`
4. `/users`
5. `/settings`

## Design constraints

- Keep the current product scope
- Avoid purple/indigo enterprise SaaS styling
- Avoid heavy glassmorphism, blur, neon glow, and ornamental landing-page effects
- Design desktop-first, but keep mobile usable
- Preserve a practical operations-tool rhythm rather than making the app feel promotional
""",
        encoding="utf-8",
    )

    (HANDOFF_DIR / "README.md").write_text(
        """# Stitch Handoff Bundle

This folder is prepared so the current project can be handed to Stitch immediately.

## Send in this order

1. `01-product-summary.md`
2. screenshots in `07-current-ui-screens/`
3. `03-system-report.md`
4. `04-prd-excerpt.md`
5. `05-ui-guide.md`
6. `02-redesign-goals.md`
7. `08-stitch-prompt.md`

## Folder map

- `01-product-summary.md`: short product and workflow summary
- `02-redesign-goals.md`: what to keep, what to improve, and priority screens
- `03-system-report.md`: current implementation and system behavior
- `04-prd-excerpt.md`: UI-relevant PRD scope and users
- `05-ui-guide.md`: visual language and anti-patterns
- `07-current-ui-screens/`: actual current UI screenshots
- `08-stitch-prompt.md`: copy-ready prompt
- `09-stitch-handoff-checklist.md`: final checklist
- `10-stitch-screenshot-plan.md`: capture plan used to create the screenshots

## Notes

- Screenshots were generated from the running local app.
- Test accounts were created only to populate realistic operator and teacher flows.
- If you want a lighter handoff, send the product summary, redesign goals, system report, UI guide, prompt, and the screenshots only.
""",
        encoding="utf-8",
    )


def write_screen_index(items: list[CaptureItem]) -> None:
    lines = [
        "# Screenshot Index",
        "",
        "Each screenshot below is intended to show the current UI to Stitch so redesign suggestions are grounded in the real app.",
        "",
    ]

    for item in items:
        lines.extend(
            [
                f"- `{item.filename}`",
                f"  Route: `{item.route}`",
                f"  State: {item.state}",
                f"  Note: {item.note}",
            ]
        )

    (HANDOFF_DIR / "06-screen-index.md").write_text("\n".join(lines) + "\n", encoding="utf-8")


def goto_and_wait(page: Page, path: str) -> None:
    try:
        page.goto(f"{BASE_URL}{path}", wait_until="domcontentloaded")
    except Error as error:
        if "ERR_ABORTED" not in str(error):
            raise
    page.wait_for_load_state("networkidle")
    wait_for_idle()


def submit_auth(page: Page, email: str, password: str, button_name: str) -> None:
    page.get_by_label("Email").fill(email)
    page.get_by_label("Password").fill(password)
    page.get_by_role("button", name=button_name).click()


def start_operator_signup(page: Page, operator_email: str, password: str) -> None:
    goto_and_wait(page, "/signup")
    submit_auth(page, operator_email, password, "회원가입")
    page.wait_for_url("**/organization")
    wait_for_idle()


def complete_operator_onboarding(page: Page, org_name: str, village_name: str) -> None:
    page.get_by_placeholder("다도리인 교육 센터").fill(org_name)
    page.get_by_placeholder("동네 배움터").fill(village_name)
    page.get_by_role("button", name="기관 만들기").click()
    page.wait_for_url("**/organization/complete")
    wait_for_idle()
    page.get_by_role("link", name="대시보드로 이동").click()
    page.wait_for_url("**/dashboard")
    wait_for_idle()


def fill_settings(page: Page, village_name: str, program_name: str, class_name: str) -> None:
    goto_and_wait(page, "/settings")
    page.get_by_placeholder("예: 문해 프로그램").fill(program_name)
    page.get_by_placeholder("프로그램 설명").fill("Stitch redesign capture용 운영 프로그램")
    page.get_by_role("button", name="프로그램 추가").click()
    page.get_by_placeholder("예: 기초 문해 수업").fill(class_name)
    page.get_by_placeholder("수업 설명").fill("운영자와 강사 화면 캡처를 위한 샘플 수업")
    class_selects = page.locator("select[name='programId']")
    class_selects.first.select_option(label=program_name)
    page.locator("select[name='villageId']").select_option(label=village_name)
    page.get_by_role("button", name="수업 추가").click()

    participants = [
        ("홍길동", "출석 체크가 잦음"),
        ("김영희", "집중력이 좋아 활동 메모에 자주 등장"),
    ]
    for full_name, note in participants:
        page.get_by_placeholder("예: 홍길동").fill(full_name)
        page.get_by_placeholder("참여자 메모").fill(note)
        page.locator("select[name='classId']").select_option(label=class_name)
        page.get_by_role("button", name="참여자 추가").click()
        wait_for_idle()


def extract_invite_token(page: Page) -> str:
    feedback = page.get_by_text("초대 링크를 만들었습니다. 토큰:").last
    text = feedback.text_content() or ""
    match = re.search(r"([0-9a-fA-F-]{36})", text)
    if not match:
        raise RuntimeError("Failed to extract invite token from users screen.")
    return match.group(1)


def invite_teacher(page: Page, teacher_email: str) -> str:
    goto_and_wait(page, "/users")
    page.get_by_placeholder("teacher@example.com").fill(teacher_email)
    page.locator("select[name='role']").first.select_option("teacher")
    page.get_by_role("button", name="초대 링크 만들기").click()
    wait_for_idle()
    return extract_invite_token(page)


def teacher_accept_invite(page: Page, teacher_email: str, password: str, invite_token: str) -> None:
    goto_and_wait(page, "/signup")
    submit_auth(page, teacher_email, password, "회원가입")
    page.wait_for_url("**/organization")
    wait_for_idle()
    page.get_by_placeholder("c27da9ba-dc9a-494b-8742-8ad3e42671d3").fill(invite_token)
    page.get_by_role("button", name="기존 기관 참여").click()
    page.wait_for_url("**/approval-pending")
    wait_for_idle()


def approve_and_assign_teacher(page: Page, teacher_email: str, class_name: str) -> None:
    goto_and_wait(page, "/users")
    page.get_by_role("button", name="접근 승인").click()
    wait_for_idle()

    page.locator("select[name='userId']").select_option(label=teacher_email)
    page.locator("select[name='classId']").last.select_option(label=class_name)
    page.get_by_role("button", name="강사 배정").click()
    wait_for_idle()


def create_session(page: Page, village_name: str, program_name: str, class_name: str, teacher_email: str) -> None:
    goto_and_wait(page, "/dashboard")
    today = "2026-04-16"
    page.locator("input[name='sessionDate']").fill(today)
    page.locator("select[name='villageId']").select_option(label=village_name)
    page.locator("select[name='programId']").select_option(label=program_name)
    page.locator("select[name='classId']").select_option(index=1)
    page.locator("select[name='teacherId']").select_option(label=f"{class_name} · {teacher_email}")
    page.get_by_role("button", name="세션 생성").click()
    wait_for_idle()


def login(page: Page, email: str, password: str) -> None:
    goto_and_wait(page, "/login")
    submit_auth(page, email, password, "로그인")
    page.wait_for_load_state("networkidle")
    wait_for_idle()


def submit_teacher_session(page: Page) -> None:
    goto_and_wait(page, "/sessions")
    page.get_by_role("link").first.click()
    page.wait_for_url("**/sessions/*")
    wait_for_idle()
    selects = page.locator("select[name^='attendance:']")
    if selects.count() > 1:
        selects.nth(1).select_option("late")
    if selects.count() > 0:
        selects.nth(0).select_option("present")
    page.locator("textarea[name='lessonJournal']").fill(
        "오늘은 읽기 카드 활동과 짝 토론을 진행했습니다.\n두 번째 참여자는 발화가 늘어나는 변화가 보였습니다."
    )

    attachment_file = tempfile.NamedTemporaryFile("w", delete=False, suffix=".txt")
    attachment_path = Path(attachment_file.name)
    attachment_file.write("stitch capture attachment")
    attachment_file.close()
    page.locator("input[type='file'][name='attachment']").set_input_files(str(attachment_path))
    page.get_by_role("button", name="첨부 업로드").click()
    wait_for_idle()
    page.get_by_role("button", name="최종 제출").click()
    wait_for_idle()
    attachment_path.unlink(missing_ok=True)


def capture_mobile_dashboard(operator_email: str, password: str, items: list[CaptureItem]) -> None:
    with sync_playwright() as playwright:
        iphone = playwright.devices["iPhone 13"]
        browser = playwright.chromium.launch(headless=True)
        context = browser.new_context(**iphone)
        page = context.new_page()
        login(page, operator_email, password)
        page.wait_for_url("**/dashboard")
        item = CaptureItem(
            filename="22-dashboard-mobile.png",
            route="/dashboard",
            state="mobile with populated dashboard data",
            note="Operator dashboard on mobile width.",
        )
        capture(page, item)
        items.append(item)
        context.close()
        browser.close()


def capture_mobile_teacher_session(teacher_email: str, password: str, items: list[CaptureItem]) -> None:
    with sync_playwright() as playwright:
        iphone = playwright.devices["iPhone 13"]
        browser = playwright.chromium.launch(headless=True)
        context = browser.new_context(**iphone)
        page = context.new_page()
        login(page, teacher_email, password)
        page.wait_for_url("**/sessions")
        page.get_by_role("link").first.click()
        page.wait_for_url("**/sessions/*")
        item = CaptureItem(
            filename="23-teacher-session-mobile.png",
            route="/sessions/[sessionId]",
            state="mobile teacher session detail",
            note="Teacher session workspace on mobile width after submission.",
        )
        capture(page, item)
        items.append(item)
        context.close()
        browser.close()


def main() -> None:
    run_id = str(int(time()))
    operator_email = f"stitch-operator-{run_id}@example.com"
    teacher_email = f"stitch-teacher-{run_id}@example.com"
    password = "Harness123!"
    org_name = f"스티치 테스트 기관 {run_id[-4:]}"
    village_name = "중앙 마을"
    program_name = "문해 프로그램"
    class_name = "기초 문해 수업"

    HANDOFF_DIR.mkdir(parents=True, exist_ok=True)
    ensure_clean_output_dir()
    copy_reference_docs()
    write_bundle_docs()

    capture_items: list[CaptureItem] = []

    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True)
        operator_context = browser.new_context(viewport={"width": 1440, "height": 1800})
        operator_page = operator_context.new_page()

        goto_and_wait(operator_page, "/login")
        item = CaptureItem(
            filename="01-login-default.png",
            route="/login",
            state="default desktop login screen",
            note="Initial login screen before any session is created.",
        )
        capture(operator_page, item)
        capture_items.append(item)

        goto_and_wait(operator_page, "/signup")
        item = CaptureItem(
            filename="02-signup-default.png",
            route="/signup",
            state="default desktop signup screen",
            note="Initial signup screen before operator account creation.",
        )
        capture(operator_page, item)
        capture_items.append(item)

        start_operator_signup(operator_page, operator_email, password)
        item = CaptureItem(
            filename="03-organization-default.png",
            route="/organization",
            state="organization onboarding after signup",
            note="Default onboarding state immediately after operator signup.",
        )
        capture(operator_page, item)
        capture_items.append(item)

        operator_page.get_by_placeholder("다도리인 교육 센터").fill("가")
        operator_page.get_by_placeholder("동네 배움터").fill("나")
        operator_page.get_by_role("button", name="기관 만들기").click()
        wait_for_idle()
        item = CaptureItem(
            filename="04-organization-validation.png",
            route="/organization",
            state="validation errors on onboarding form",
            note="Shows onboarding error messaging with too-short values.",
        )
        capture(operator_page, item)
        capture_items.append(item)

        complete_operator_onboarding(operator_page, org_name, village_name)

        goto_and_wait(operator_page, "/organization/complete")
        item = CaptureItem(
            filename="05-organization-complete.png",
            route="/organization/complete",
            state="organization created confirmation",
            note="Confirmation and next actions after initial organization creation.",
        )
        capture(operator_page, item)
        capture_items.append(item)

        goto_and_wait(operator_page, "/dashboard")
        item = CaptureItem(
            filename="06-dashboard-empty.png",
            route="/dashboard",
            state="operator dashboard before setup data exists",
            note="Dashboard empty state with setup gaps and no sessions.",
        )
        capture(operator_page, item)
        capture_items.append(item)

        goto_and_wait(operator_page, "/settings")
        item = CaptureItem(
            filename="07-settings-empty.png",
            route="/settings",
            state="settings empty state",
            note="Settings page before program, class, or participants are added.",
        )
        capture(operator_page, item)
        capture_items.append(item)

        fill_settings(operator_page, village_name, program_name, class_name)
        item = CaptureItem(
            filename="08-settings-filled.png",
            route="/settings",
            state="settings filled with program, class, and participants",
            note="Settings after sample data has been created.",
        )
        capture(operator_page, item)
        capture_items.append(item)

        goto_and_wait(operator_page, "/users")
        item = CaptureItem(
            filename="09-users-before-invite.png",
            route="/users",
            state="users page before teacher invite",
            note="Shows only the admin member before invite flow begins.",
        )
        capture(operator_page, item)
        capture_items.append(item)

        invite_token = invite_teacher(operator_page, teacher_email)

        teacher_context = browser.new_context(viewport={"width": 1440, "height": 1800})
        teacher_page = teacher_context.new_page()
        teacher_accept_invite(teacher_page, teacher_email, password, invite_token)
        item = CaptureItem(
            filename="10-approval-pending.png",
            route="/approval-pending",
            state="teacher waiting for admin approval",
            note="Approval pending screen after invite token acceptance.",
        )
        capture(teacher_page, item)
        capture_items.append(item)

        goto_and_wait(operator_page, "/users")
        item = CaptureItem(
            filename="11-users-pending-approval.png",
            route="/users",
            state="users page with pending teacher membership",
            note="Teacher has joined by invite but is not approved yet.",
        )
        capture(operator_page, item)
        capture_items.append(item)

        approve_and_assign_teacher(operator_page, teacher_email, class_name)
        item = CaptureItem(
            filename="12-users-assigned.png",
            route="/users",
            state="approved and assigned teacher",
            note="Teacher is approved and assigned to the class.",
        )
        capture(operator_page, item)
        capture_items.append(item)

        goto_and_wait(teacher_page, "/sessions")
        item = CaptureItem(
            filename="13-teacher-sessions-empty.png",
            route="/sessions",
            state="teacher sessions page before admin creates a session",
            note="Approved teacher with no assigned session instances yet.",
        )
        capture(teacher_page, item)
        capture_items.append(item)

        goto_and_wait(operator_page, "/dashboard")
        item = CaptureItem(
            filename="14-dashboard-ready-for-session.png",
            route="/dashboard",
            state="dashboard after setup but before first session",
            note="Dashboard with setup complete and ready to create the first session.",
        )
        capture(operator_page, item)
        capture_items.append(item)

        create_session(operator_page, village_name, program_name, class_name, teacher_email)
        item = CaptureItem(
            filename="15-dashboard-with-session.png",
            route="/dashboard",
            state="dashboard after session creation",
            note="Dashboard with a newly created session and pending submission state.",
        )
        capture(operator_page, item)
        capture_items.append(item)

        goto_and_wait(operator_page, "/records")
        item = CaptureItem(
            filename="16-records-pending.png",
            route="/records",
            state="records browser with a pending session",
            note="Records browser before the teacher submits the session.",
        )
        capture(operator_page, item)
        capture_items.append(item)

        goto_and_wait(teacher_page, "/sessions")
        item = CaptureItem(
            filename="17-teacher-sessions-filled.png",
            route="/sessions",
            state="teacher sessions list with one assigned session",
            note="Teacher list screen after the operator creates the first session.",
        )
        capture(teacher_page, item)
        capture_items.append(item)

        teacher_page.get_by_role("link").first.click()
        teacher_page.wait_for_url("**/sessions/*")
        item = CaptureItem(
            filename="18-teacher-session-default.png",
            route="/sessions/[sessionId]",
            state="teacher session workspace before first submission",
            note="Session workspace with attendance rows, journal, and attachment upload.",
        )
        capture(teacher_page, item)
        capture_items.append(item)

        submit_teacher_session(teacher_page)
        item = CaptureItem(
            filename="19-teacher-session-submitted.png",
            route="/sessions/[sessionId]",
            state="teacher session after submission and attachment upload",
            note="Session workspace after the first submission is saved.",
        )
        capture(teacher_page, item)
        capture_items.append(item)

        goto_and_wait(operator_page, "/records")
        item = CaptureItem(
            filename="20-records-filled.png",
            route="/records",
            state="records browser after teacher submission",
            note="Records browser showing submitted state.",
        )
        capture(operator_page, item)
        capture_items.append(item)

        operator_page.get_by_role("link").first.click()
        operator_page.wait_for_url("**/records/*")
        item = CaptureItem(
            filename="21-record-detail-filled.png",
            route="/records/[sessionId]",
            state="record detail after submission",
            note="Record detail with attendance, lesson journal, and attachment list.",
        )
        capture(operator_page, item)
        capture_items.append(item)

        operator_context.close()
        teacher_context.close()
        browser.close()

    capture_mobile_dashboard(operator_email, password, capture_items)
    capture_mobile_teacher_session(teacher_email, password, capture_items)

    metadata = {
        "base_url": BASE_URL,
        "generated_at_unix": int(time()),
        "screenshots": [item.__dict__ for item in capture_items],
    }
    (HANDOFF_DIR / "bundle-meta.json").write_text(
        json.dumps(metadata, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    write_screen_index(capture_items)


if __name__ == "__main__":
    main()
