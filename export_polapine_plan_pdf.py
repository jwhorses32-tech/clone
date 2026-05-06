from pathlib import Path
import re

from reportlab.lib.pagesizes import LETTER
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, ListFlowable, ListItem


SOURCE_PATH = Path(r"c:\Users\windfall\.cursor\plans\polapine_clone_plan_6cd6f0e8.plan.md")
OUTPUT_PATH = Path(r"c:\Users\windfall\Desktop\Projects\GR\Polapine_Clone_Plan.pdf")
DOC_TITLE = "Polapine Clone \u2014 Build Plan"


def load_body_markdown(path: Path) -> tuple[dict, list[str]]:
    """Strip YAML-ish frontmatter and return (frontmatter_text, body_lines)."""
    text = path.read_text(encoding="utf-8")
    lines = text.splitlines()

    frontmatter_lines: list[str] = []
    if lines and lines[0].strip() == "---":
        end_idx = None
        for i in range(1, len(lines)):
            if lines[i].strip() == "---":
                end_idx = i
                break
        if end_idx is not None:
            frontmatter_lines = lines[1:end_idx]
            lines = lines[end_idx + 1 :]

    fm: dict = {"name": None, "overview": None, "todos": []}
    current_todo: dict | None = None
    for fl in frontmatter_lines:
        if fl.startswith("name:"):
            fm["name"] = fl.split(":", 1)[1].strip()
        elif fl.startswith("overview:"):
            fm["overview"] = fl.split(":", 1)[1].strip()
        elif re.match(r"^\s*-\s+id:\s*", fl):
            if current_todo:
                fm["todos"].append(current_todo)
            current_todo = {"id": re.sub(r"^\s*-\s+id:\s*", "", fl).strip(), "content": "", "status": ""}
        elif current_todo is not None:
            m_content = re.match(r"^\s*content:\s*(.*)$", fl)
            m_status = re.match(r"^\s*status:\s*(.*)$", fl)
            if m_content:
                current_todo["content"] = m_content.group(1).strip().strip('"')
            elif m_status:
                current_todo["status"] = m_status.group(1).strip()
    if current_todo:
        fm["todos"].append(current_todo)

    return fm, lines


def clean_inline(text: str) -> str:
    text = text.replace("`", "")
    text = re.sub(r"\[([^\]]+)\]\(([^)]+)\)", r"\1", text)
    text = text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    text = re.sub(r"\*\*(.*?)\*\*", r"<b>\1</b>", text)
    text = re.sub(r"(?<!\*)\*(?!\*)([^*]+)\*(?!\*)", r"<i>\1</i>", text)
    return text


def build_pdf(fm: dict, lines: list[str], output_path: Path) -> None:
    doc = SimpleDocTemplate(
        str(output_path),
        pagesize=LETTER,
        leftMargin=0.9 * inch,
        rightMargin=0.9 * inch,
        topMargin=0.8 * inch,
        bottomMargin=0.8 * inch,
        title=DOC_TITLE,
    )

    styles = getSampleStyleSheet()
    h1 = ParagraphStyle("H1", parent=styles["Heading1"], fontSize=20, spaceAfter=10)
    h2 = ParagraphStyle("H2", parent=styles["Heading2"], fontSize=14, spaceBefore=10, spaceAfter=6)
    h3 = ParagraphStyle("H3", parent=styles["Heading3"], fontSize=12, spaceBefore=6, spaceAfter=4)
    body = ParagraphStyle("Body", parent=styles["BodyText"], fontSize=10.5, leading=14, spaceAfter=4)
    subtle = ParagraphStyle("Subtle", parent=body, textColor="#555555", fontSize=10, spaceAfter=8)
    code = ParagraphStyle(
        "Code",
        parent=styles["Code"],
        fontName="Courier",
        fontSize=9,
        leading=12,
        leftIndent=14,
        spaceAfter=2,
    )

    story: list = []

    if fm.get("name"):
        story.append(Paragraph(clean_inline(fm["name"]), h1))
    if fm.get("overview"):
        story.append(Paragraph(clean_inline(fm["overview"]), subtle))
        story.append(Spacer(1, 6))

    in_code_block = False
    in_mermaid = False

    for raw in lines:
        line = raw.rstrip()
        stripped = line.strip()

        if stripped.startswith("```"):
            in_code_block = not in_code_block
            if in_code_block and stripped.lower().startswith("```mermaid"):
                in_mermaid = True
                story.append(Paragraph("<b>Architecture diagram (Mermaid source):</b>", body))
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
        if stripped.startswith("### "):
            story.append(Paragraph(clean_inline(stripped[4:]), h3))
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

    if fm.get("todos"):
        story.append(Spacer(1, 10))
        story.append(Paragraph("Delivery checklist", h2))
        for t in fm["todos"]:
            content = clean_inline(t.get("content", ""))
            status = (t.get("status") or "pending").strip()
            text = f"<b>[{status}]</b> {content}"
            list_item = ListItem(Paragraph(text, body), leftIndent=12)
            story.append(ListFlowable([list_item], bulletType="bullet", start="square", leftIndent=12))

    doc.build(story)


if __name__ == "__main__":
    fm, markdown_lines = load_body_markdown(SOURCE_PATH)
    build_pdf(fm, markdown_lines, OUTPUT_PATH)
    print(f"PDF exported: {OUTPUT_PATH}")
