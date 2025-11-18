import React, { useState } from "react";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";
import pdfMake from "pdfmake/build/pdfmake";
import "./DownloadNotes.css"; // 👈 ny CSS-fil

export default function DownloadNotes({ fileName, markdownText }) {
  const [downloadType, setDownloadType] = useState("PDF"); // Bestemmer hvilken type document det skal downloades som

  // -------- PDF DOWNLOAD --------
  const handleDownloadPDF = async () => {
    try {
      const fontsModule = await import("pdfmake/build/vfs_fonts.js");
      const fonts = fontsModule.default || fontsModule;
      pdfMake.vfs = fonts.pdfMake ? fonts.pdfMake.vfs : fonts.vfs;

      const lines = markdownText.split("\n");
      const content = [];
      let inCode = false;
      let codeBuffer = [];

      lines.forEach((line) => {
        if (line.startsWith("```")) {
          if (inCode) {
            content.push({ text: codeBuffer.join("\n"), style: "code" });
            codeBuffer = [];
          }
          inCode = !inCode;
          return;
        }

        if (inCode) {
          codeBuffer.push(line);
          return;
        }

        if (line.startsWith("# ")) {
          content.push({ text: line.replace("# ", ""), style: "h1" });
        } else if (line.startsWith("## ")) {
          content.push({ text: line.replace("## ", ""), style: "h2" });
        } else if (line.startsWith("### ")) {
          content.push({ text: line.replace("### ", ""), style: "h3" });
        } else if (line.trim() !== "") {
          content.push({ text: line.trim(), style: "paragraph" });
        }
      });

      const docDefinition = {
        pageMargins: [40, 60, 40, 60],
        content,
        styles: {
          h1: {
            fontSize: 20,
            bold: true,
            color: "#581F18",
            margin: [0, 14, 0, 8],
            decoration: "underline",
            decorationColor: "#F18805",
          },
          h2: {
            fontSize: 16,
            bold: true,
            color: "#581F18",
            margin: [0, 10, 0, 6],
          },
          h3: {
            fontSize: 14,
            bold: true,
            color: "#581F18",
            margin: [0, 8, 0, 5],
          },
          paragraph: {
            fontSize: 11,
            lineHeight: 1.4,
            margin: [0, 3, 0, 6],
            color: "#2E2E2E",
          },
          code: {
            fontSize: 10,
            font: "Roboto",
            color: "#581F18",
            background: "#FFF9F5",
            margin: [0, 4, 0, 8],
            fillColor: "#FFF9F5",
          },
        },
        defaultStyle: { font: "Roboto" },
      };

      pdfMake.createPdf(docDefinition).download(`${fileName || "notes"}.pdf`);
    } catch (err) {
      console.error("❌ PDF download failed", err);
    }
  };

  // -------- WORD DOWNLOAD --------
  const handleDownloadWord = async () => {
    const lines = markdownText.split("\n");
    const paragraphs = [];
    const codeBlockStartRegex = /^```/;
    let inCode = false;
    let buffer = [];

    const pushCode = () => {
      paragraphs.push(
        new Paragraph({
          children: [new TextRun({ text: buffer.join("\n"), font: "Consolas" })],
          shading: { fill: "FFF9F5" },
          spacing: { before: 200, after: 200 },
          style: "Normal",
        })
      );
      buffer = [];
    };

    for (const line of lines) {
      if (codeBlockStartRegex.test(line)) {
        if (inCode) pushCode();
        inCode = !inCode;
        continue;
      }

      if (inCode) {
        buffer.push(line);
        continue;
      }

      if (line.startsWith("# ")) {
        paragraphs.push(
          new Paragraph({
            text: line.replace("# ", ""),
            heading: "Heading1",
            spacing: { before: 240, after: 120 },
          })
        );
      } else if (line.startsWith("## ")) {
        paragraphs.push(
          new Paragraph({
            text: line.replace("## ", ""),
            heading: "Heading2",
            spacing: { before: 200, after: 100 },
          })
        );
      } else if (line.startsWith("### ")) {
        paragraphs.push(
          new Paragraph({
            text: line.replace("### ", ""),
            heading: "Heading3",
            spacing: { before: 160, after: 90 },
          })
        );
      } else if (line.trim() !== "") {
        paragraphs.push(
          new Paragraph({
            text: line.trim(),
            style: "Normal",
            spacing: { after: 100 },
          })
        );
      }
    }

    const doc = new Document({ sections: [{ children: paragraphs }] });
    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${fileName?.replace(/\.[^/.]+$/, "") || "notes"}.docx`);
  };

  // Tjekker den downloadType der er valgt, og sender den videre
  const handleDownload = () => {
    downloadType === "Word" ? handleDownloadWord() : handleDownloadPDF();
  };


  // INDHOLDET SOM VISES - 
  return (
    <div className="download-section">
      {/* SWITCH mellem PDF og Word */}
      <div
        className="download-toggle"
        onClick={() =>
          setDownloadType(downloadType === "PDF" ? "Word" : "PDF")
        }
      >
        <span className="toggle-label">PDF</span>
        <div
          className={`toggle-switch ${
            downloadType === "Word" ? "switch-right" : "switch-left"
          }`}
        ></div>
        <span className="toggle-label">Word</span>
      </div>

      {/* DOWNLOAD BUTTON */}
      <button className="download-btn" onClick={handleDownload}>
        Download Notes as {downloadType}
      </button>
    </div>
  );
}