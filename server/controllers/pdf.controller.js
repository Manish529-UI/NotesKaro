import PDFDocument from "pdfkit";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const LOGO_PATH = path.join(__dirname, "..", "assets", "logo.png");

export const pdfDownload = async (req, res) => {
    try {
        const { result } = req.body;

        if (!result) {
            return res.status(400).json({ error: "No content provided" });
        }

        const doc = new PDFDocument({
            margin: 45,
            bufferPages: true,
            size: "A4",
            info: {
                Title: `NotesKaro — ${result.topic || "Study Notes"}`,
                Author: "NotesKaro",
                Subject: "AI-Generated Study Notes",
            },
        });

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
            "Content-Disposition",
            'attachment; filename="NotesKaro.pdf"'
        );
        doc.pipe(res);

        // ─── Color Palette ───────────────────────────────────────────
        const INDIGO = "#4F46E5";
        const PURPLE = "#7C3AED";
        const DARK = "#111827";
        const BODY = "#374151";
        const MUTED = "#6B7280";
        const GREEN = "#059669";
        const ROSE = "#E11D48";
        const LIGHT_INDIGO = "#EEF2FF";
        const LIGHT_GREEN = "#ECFDF5";
        const LIGHT_ROSE = "#FFF1F2";
        const LIGHT_GRAY = "#F9FAFB";
        const BORDER_GRAY = "#E5E7EB";

        const PAGE_WIDTH = 595.28; // A4
        const MARGIN = 45;
        const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
        const SAFE_BOTTOM = 760; // leave room for footer

        // ─── Helpers ─────────────────────────────────────────────────

        /** Check if we need a page break, add one if so */
        const ensureSpace = (needed = 80) => {
            if (doc.y + needed > SAFE_BOTTOM) {
                doc.addPage();
                drawPageDecoration();
            }
        };

        /** Thin accent line at top of every continuation page */
        const drawPageDecoration = () => {
            doc.rect(0, 0, PAGE_WIDTH, 4).fill(INDIGO);
        };

        /** Draw a section header with left accent bar & tinted background */
        const drawSectionHeader = (title, accentColor = INDIGO, bgColor = LIGHT_INDIGO) => {
            ensureSpace(50);
            const y = doc.y;
            // Background pill
            doc.roundedRect(MARGIN, y, CONTENT_WIDTH, 30, 4).fill(bgColor);
            // Left accent bar
            doc.rect(MARGIN, y, 4, 30).fill(accentColor);
            // Title text
            doc.fillColor(accentColor)
                .font("Helvetica-Bold")
                .fontSize(12)
                .text(title.toUpperCase(), MARGIN + 14, y + 9, {
                    width: CONTENT_WIDTH - 20,
                });
            doc.y = y + 38;
            doc.fillColor(BODY);
        };

        /** Draw a subtle horizontal divider */
        const drawDivider = () => {
            const y = doc.y + 4;
            doc.moveTo(MARGIN + 20, y).lineTo(PAGE_WIDTH - MARGIN - 20, y).lineWidth(0.5).strokeColor(BORDER_GRAY).stroke();
            doc.y = y + 10;
        };

        /** Parse simple markdown-like text and render: **bold**, *italic*, bullet lines */
        const renderFormattedText = (text, opts = {}) => {
            if (!text) return;
            const lines = String(text).split("\n");

            for (const line of lines) {
                ensureSpace(18);
                const trimmed = line.trim();
                if (!trimmed) {
                    doc.moveDown(0.3);
                    continue;
                }

                // Bullet point lines
                if (/^[-•*]\s/.test(trimmed)) {
                    const bulletText = trimmed.replace(/^[-•*]\s+/, "");
                    doc.font("Helvetica").fontSize(10).fillColor(INDIGO).text("  •  ", { continued: true });
                    renderInlineFormatted(bulletText);
                    continue;
                }

                // Heading lines (### or ##)
                if (/^#{1,3}\s/.test(trimmed)) {
                    const headingText = trimmed.replace(/^#{1,3}\s+/, "");
                    ensureSpace(30);
                    doc.font("Helvetica-Bold")
                        .fontSize(trimmed.startsWith("###") ? 11 : 12)
                        .fillColor(PURPLE)
                        .text(headingText);
                    doc.moveDown(0.3);
                    continue;
                }

                // Regular paragraph
                renderInlineFormatted(trimmed);
            }
        };

        /** Render inline bold (**text**) and italic (*text*) */
        const renderInlineFormatted = (text) => {
            // Split by **bold** and *italic* markers
            const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
            let first = true;
            for (let i = 0; i < parts.length; i++) {
                const part = parts[i];
                if (!part) continue;
                const isLast = i === parts.length - 1 || parts.slice(i + 1).every((p) => !p);

                if (part.startsWith("**") && part.endsWith("**")) {
                    const clean = part.slice(2, -2);
                    doc.font("Helvetica-Bold").fontSize(10).fillColor(DARK);
                    if (isLast) doc.text(clean); else doc.text(clean, { continued: true });
                } else if (part.startsWith("*") && part.endsWith("*")) {
                    const clean = part.slice(1, -1);
                    doc.font("Helvetica-Oblique").fontSize(10).fillColor(MUTED);
                    if (isLast) doc.text(clean); else doc.text(clean, { continued: true });
                } else {
                    doc.font("Helvetica").fontSize(10).fillColor(BODY);
                    if (isLast) doc.text(part); else doc.text(part, { continued: true });
                }
                first = false;
            }
        };

        /** Extract displayable text from a question object */
        const questionText = (q) => {
            if (typeof q === "string") return q;
            if (q && typeof q === "object") return q.question || q.q || q.title || JSON.stringify(q);
            return String(q || "");
        };

        const answerText = (q) => {
            if (q && typeof q === "object") return q.answer || q.a || null;
            return null;
        };

        // ═══════════════════════════════════════════════════════════════
        //  PAGE 1 — PREMIUM COVER HEADER WITH LOGO
        // ═══════════════════════════════════════════════════════════════

        // Multi-layer header background
        doc.rect(0, 0, PAGE_WIDTH, 90).fill(INDIGO);
        // Subtle darker bottom strip
        doc.rect(0, 75, PAGE_WIDTH, 15).fill(PURPLE);
        // Decorative circle elements (subtle geometric accents)
        doc.save();
        doc.opacity(0.08);
        doc.circle(PAGE_WIDTH - 60, 45, 80).fill("#FFFFFF");
        doc.circle(PAGE_WIDTH - 120, 20, 40).fill("#FFFFFF");
        doc.circle(80, 70, 50).fill("#FFFFFF");
        doc.restore();

        // Logo
        try {
            doc.image(LOGO_PATH, MARGIN, 14, { width: 50, height: 50 });
        } catch (e) {
            // If logo file not found, draw a fallback circle icon
            doc.circle(MARGIN + 25, 39, 22).fill("#FFFFFF");
            doc.fillColor(INDIGO).font("Helvetica-Bold").fontSize(18).text("N", MARGIN + 17, 28);
        }

        // Title text next to logo
        doc.fillColor("#FFFFFF")
            .font("Helvetica-Bold")
            .fontSize(24)
            .text("NotesKaro", MARGIN + 60, 18);

        // Subtitle
        doc.fillColor("rgba(255,255,255,0.8)")
            .font("Helvetica")
            .fontSize(10)
            .text("AI-Powered Exam-Oriented Study Notes", MARGIN + 60, 48);

        // Thin gold/amber accent line at bottom of header
        doc.rect(0, 88, PAGE_WIDTH, 2).fill("#F59E0B");

        doc.y = 105;
        doc.fillColor(BODY);

        // ─── Importance Badge ────────────────────────────────────────
        if (result.importance) {
            const y = doc.y;
            doc.roundedRect(MARGIN, y, CONTENT_WIDTH, 28, 4).fill(LIGHT_INDIGO);
            doc.fillColor(PURPLE).font("Helvetica-Bold").fontSize(10).text("IMPORTANCE:", MARGIN + 12, y + 8, { continued: true });
            doc.fillColor(GREEN).font("Helvetica-Bold").text(`  ${result.importance}`);
            doc.y = y + 38;
        }

        // ═══════════════════════════════════════════════════════════════
        //  SUB TOPICS
        // ═══════════════════════════════════════════════════════════════
        if (result.subTopics && Object.keys(result.subTopics).length > 0) {
            drawSectionHeader("Sub Topics & Priorities", INDIGO, LIGHT_INDIGO);

            Object.entries(result.subTopics).forEach(([star, topics]) => {
                ensureSpace(30);
                doc.font("Helvetica-Bold").fontSize(10).fillColor(PURPLE).text(`${star} Topics:`);
                doc.moveDown(0.2);

                if (Array.isArray(topics)) {
                    topics.forEach((t) => {
                        ensureSpace(16);
                        const text =
                            typeof t === "object"
                                ? t.topic || t.title || JSON.stringify(t)
                                : String(t);
                        doc.font("Helvetica").fontSize(9.5).fillColor(BODY).text(`    •  ${text}`, { lineGap: 2 });
                    });
                }
                doc.moveDown(0.4);
            });

            doc.moveDown(0.5);
            drawDivider();
        }

        // ═══════════════════════════════════════════════════════════════
        //  DETAILED NOTES
        // ═══════════════════════════════════════════════════════════════
        if (result.notes) {
            drawSectionHeader("Detailed Notes", PURPLE, "#F5F3FF");

            const notesText =
                typeof result.notes === "string"
                    ? result.notes
                    : String(result.notes);

            renderFormattedText(notesText);
            doc.moveDown(0.8);
            drawDivider();
        }

        // ═══════════════════════════════════════════════════════════════
        //  QUICK REVISION POINTS
        // ═══════════════════════════════════════════════════════════════
        if (Array.isArray(result.revisionPoints) && result.revisionPoints.length > 0) {
            drawSectionHeader("Quick Revision Points", GREEN, LIGHT_GREEN);

            result.revisionPoints.forEach((p, idx) => {
                ensureSpace(22);
                const text =
                    typeof p === "object"
                        ? p.point || p.text || JSON.stringify(p)
                        : String(p);

                // Green checkmark bullet
                doc.font("Helvetica-Bold").fontSize(10).fillColor(GREEN).text(`  ✔  `, { continued: true });
                doc.font("Helvetica").fontSize(10).fillColor(BODY).text(text, { lineGap: 2 });
            });

            doc.moveDown(0.8);
            drawDivider();
        }

        // ═══════════════════════════════════════════════════════════════
        //  IMPORTANT QUESTIONS
        // ═══════════════════════════════════════════════════════════════
        if (result.questions) {
            drawSectionHeader("Important Questions", ROSE, LIGHT_ROSE);

            // --- Short Questions ---
            if (Array.isArray(result.questions.short) && result.questions.short.length > 0) {
                ensureSpace(30);
                doc.font("Helvetica-Bold").fontSize(11).fillColor(PURPLE).text("Short Answer Questions");
                doc.moveDown(0.3);

                result.questions.short.forEach((q, idx) => {
                    ensureSpace(30);
                    const qText = questionText(q);
                    const aText = answerText(q);

                    doc.font("Helvetica-Bold").fontSize(10).fillColor(DARK).text(`Q${idx + 1}. ${qText}`, { lineGap: 2 });

                    if (aText) {
                        ensureSpace(16);
                        doc.font("Helvetica-Oblique").fontSize(9.5).fillColor(GREEN).text(`    Ans: ${aText}`, { lineGap: 2 });
                    }
                    doc.moveDown(0.3);
                });

                doc.moveDown(0.4);
            }

            // --- Long Questions ---
            if (Array.isArray(result.questions.long) && result.questions.long.length > 0) {
                ensureSpace(30);
                doc.font("Helvetica-Bold").fontSize(11).fillColor(PURPLE).text("Long Answer Questions");
                doc.moveDown(0.3);

                result.questions.long.forEach((q, idx) => {
                    ensureSpace(30);
                    const qText = questionText(q);
                    const aText = answerText(q);

                    doc.font("Helvetica-Bold").fontSize(10).fillColor(DARK).text(`Q${idx + 1}. ${qText}`, { lineGap: 2 });

                    if (aText) {
                        ensureSpace(16);
                        doc.font("Helvetica-Oblique").fontSize(9.5).fillColor(GREEN).text(`    Ans: ${aText}`, { lineGap: 2 });
                    }
                    doc.moveDown(0.3);
                });

                doc.moveDown(0.4);
            }

            // --- Diagram Question ---
            if (result.questions.diagram) {
                ensureSpace(30);
                doc.font("Helvetica-Bold").fontSize(11).fillColor(PURPLE).text("Diagram-Based Question");
                doc.moveDown(0.2);

                const diagQ = questionText(result.questions.diagram);
                doc.font("Helvetica").fontSize(10).fillColor(BODY).text(`•  ${diagQ}`, { lineGap: 2 });
                doc.moveDown(0.4);
            }

            drawDivider();
        }

        // ═══════════════════════════════════════════════════════════════
        //  DIAGRAMS & CHARTS INFO CALLOUT
        // ═══════════════════════════════════════════════════════════════
        if (result.diagram?.data || (result.charts && result.charts.length > 0)) {
            ensureSpace(70);
            drawSectionHeader("Diagrams & Charts", "#0891B2", "#ECFEFF");

            const boxY = doc.y;
            doc.roundedRect(MARGIN, boxY, CONTENT_WIDTH, 50, 6).fill(LIGHT_GRAY);
            doc.rect(MARGIN, boxY, 4, 50).fill("#0891B2");

            doc.fillColor(DARK)
                .font("Helvetica-Bold")
                .fontSize(10)
                .text("Interactive Visuals Available Online", MARGIN + 16, boxY + 10);

            doc.fillColor(MUTED)
                .font("Helvetica")
                .fontSize(9)
                .text(
                    "Mermaid diagrams and Recharts visualizations are optimized for web. Visit your NotesKaro dashboard to interact with dynamic models, flowcharts, and data graphs.",
                    MARGIN + 16,
                    boxY + 26,
                    { width: CONTENT_WIDTH - 30 }
                );

            doc.y = boxY + 60;
        }

        // ═══════════════════════════════════════════════════════════════
        //  WATERMARK + FOOTER — Applied to every page
        // ═══════════════════════════════════════════════════════════════
        const range = doc.bufferedPageRange();
        const totalPages = range.count;

        for (let i = range.start; i < range.start + totalPages; i++) {
            doc.switchToPage(i);

            // ── Center Watermark: "NotesKaro" ──
            doc.save();
            doc.opacity(0.04);
            doc.translate(PAGE_WIDTH / 2, 421);  // A4 center
            doc.rotate(-35, { origin: [0, 0] });
            doc.fillColor(INDIGO)
                .font("Helvetica-Bold")
                .fontSize(60)
                .text("NotesKaro", -200, -25, {
                    width: 400,
                    align: "center",
                });
            doc.restore();

            // ── Footer line ──
            doc.moveTo(MARGIN, 780)
                .lineTo(PAGE_WIDTH - MARGIN, 780)
                .lineWidth(0.5)
                .strokeColor(BORDER_GRAY)
                .stroke();

            // Left: branding
            doc.fillColor(MUTED)
                .font("Helvetica")
                .fontSize(7.5)
                .text("NotesKaro", MARGIN, 786);

            // Right: page number
            doc.fillColor(MUTED)
                .font("Helvetica")
                .fontSize(7.5)
                .text(`Page ${i + 1} of ${totalPages}`, PAGE_WIDTH - MARGIN - 80, 786, {
                    width: 80,
                    align: "right",
                });
        }

        doc.end();
    } catch (error) {
        console.error("PDF Generation Error:", error);
        if (!res.headersSent) {
            res.status(500).json({ error: "Failed to generate PDF" });
        }
    }
};