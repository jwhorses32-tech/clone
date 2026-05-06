from pathlib import Path
import re

from reportlab.lib.pagesizes import LETTER
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, ListFlowable, ListItem


SOURCE_PATH = Path(r"c:\Users\windfall\.cursor\plans\gaming_credits_platform_plan_a4dbe2a2.plan.md")
OUTPUT_PATH = Path(r"c:\Users\windfall\Desktop\Projects\GR\Gaming_Credits_Platform_Plan.pdf")


def load_body_markdown(path: Path) -> list[str]:
    text = path.read_text(encoding="utf-8")
    lines = text.splitlines()

    if lines and lines[0].strip() == "---":
        end_idx = None
        for i in range(1, len(lines)):
            if lines[i].strip() == "---":
                end_idx = i
                break
        if end_idx is not None:
            lines = lines[end_idx + 1 :]

    return lines


def clean_inline(text: str) -> str:
    text = text.replace("`", "")
    text = text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    text = re.sub(r"\*\*(.*?)\*\*", r"<b>\1</b>", text)
    return text


def build_pdf(lines: list[str], output_path: Path) -> None:
    doc = SimpleDocTemplate(
        str(output_path),
        pagesize=LETTER,
        leftMargin=0.9 * inch,
        rightMargin=0.9 * inch,
        topMargin=0.8 * inch,
        bottomMargin=0.8 * inch,
        title="Gaming Credits Platform Plan",
    )

    styles = getSampleStyleSheet()
    h1 = ParagraphStyle("H1", parent=styles["Heading1"], fontSize=18, spaceAfter=10)
    h2 = ParagraphStyle("H2", parent=styles["Heading2"], fontSize=13, spaceBefore=8, spaceAfter=6)
    body = ParagraphStyle("Body", parent=styles["BodyText"], fontSize=10.5, leading=14, spaceAfter=4)
    code = ParagraphStyle(
        "Code",
        parent=styles["Code"],
        fontName="Courier",
        fontSize=9,
        leading=12,
        leftIndent=14,
        spaceAfter=2,
    )

    story = []
    in_code_block = False
    in_mermaid = False

    for raw in lines:
        line = raw.rstrip()
        stripped = line.strip()

        if stripped.startswith("```"):
            in_code_block = not in_code_block
            if in_code_block and stripped.lower().startswith("```mermaid"):
                in_mermaid = True
                story.append(Paragraph("<b>Suggested System Flow (Mermaid source):</b>", body))
            elif not in_code_block:
                in_mermaid = False
                story.append(Spacer(1, 6))
            continue

        if in_code_block:
            story.append(Paragraph(clean_inline(line) if line else " ", code))
            continue

        if not stripped:
            story.append(Spacer(1, 6))
            continue

        if stripped.startswith("# "):
            story.append(Paragraph(clean_inline(stripped[2:]), h1))
            continue

        if stripped.startswith("## "):
            story.append(Paragraph(clean_inline(stripped[3:]), h2))
            continue

        bullet_match = re.match(r"^(\s*)[-*]\s+(.*)$", line)
        ordered_match = re.match(r"^(\s*)\d+\.\s+(.*)$", line)

        if bullet_match:
            text = clean_inline(bullet_match.group(2).strip())
            list_item = ListItem(Paragraph(text, body), leftIndent=12)
            story.append(ListFlowable([list_item], bulletType="bullet", start="circle", leftIndent=12))
            continue

        if ordered_match:
            text = clean_inline(ordered_match.group(2).strip())
            list_item = ListItem(Paragraph(text, body), leftIndent=12)
            story.append(ListFlowable([list_item], bulletType="1", leftIndent=12))
            continue

        if in_mermaid:
            story.append(Paragraph(clean_inline(line), code))
        else:
            story.append(Paragraph(clean_inline(stripped), body))

    doc.build(story)


if __name__ == "__main__":
    markdown_lines = load_body_markdown(SOURCE_PATH)
    build_pdf(markdown_lines, OUTPUT_PATH)
    print(f"PDF exported: {OUTPUT_PATH}")
