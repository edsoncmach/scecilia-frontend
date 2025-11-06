import { useState, useMemo } from 'react'

const SHARPS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
const FLAT_EQ: { [key: string]: string } = { Db: 'C#', Eb: 'D#', Gb: 'F#', Ab: 'G#', Bb: 'A#' }

function normalizeNote(n: string): string {
    if (!n) return n
    if (n.length >= 2 && n[1] === 'b') {
        const eq = FLAT_EQ[n.slice(0, 2)]
        if (eq) return eq + n.slice(2)
    }
    return n
}

function shiftNote(root: string, step: number): string {
    const baseMatch = root.match(/^[A-G][#b]?/)
    if (!baseMatch) return root

    const base = baseMatch[0]
    const rest = root.slice(base.length)
    const norm = normalizeNote(base)
    const i = SHARPS.indexOf(norm)
    if (i === -1) return root

    const ni = (i + step + 12) % 12
    return SHARPS[ni] + rest
}

function transposeChord(chord: string, step: number): string {
    if (chord.includes('/')) {
        const [a, b] = chord.split('/')
        return transposeChord(a, step) + '/' + transposeChord(b, step)
    }
    const m = chord.match(/^([A-G][#b]?)(.*)$/)
    if (!m) return chord
    return shiftNote(m[1] + m[2], step)
}

function transposeText(text: string, step: number): string {
    const lines = text.split('\n')
    const newLines = lines.map(line => {
        const parts = line.split(/(\s+)/)
        return parts.map(p => {
            const trimmed = p.trim()
            if (trimmed === '') return p
            if (/^[A-G][#b]?.*/.test(trimmed)) {
                const trans = transposeChord(trimmed, step)
                return p.replace(trimmed, trans)
            }
            return p
        }).join('')
    })
    return newLines.join('\n')
}

interface CifraViewerProps {
    rawText: string
}

export function CifraViewer({ rawText }: CifraViewerProps) {
    const [transposeStep, setTransposeStep] = useState(0)

    const transposedText = useMemo(() => {
        if (transposeStep === 0) return rawText
        return transposeText(rawText, transposeStep)
    }, [rawText, transposeStep])

    const renderedHtml = useMemo(() => {
        const lines = transposedText.split('\n')
        const out: string[] = []

        for (const line of lines) {
            const tokens = line.split(/(\s+)/)
            let chordCount = 0
            let tokenCount = 0
            for (const t of tokens) {
                if (t.trim() === '') continue
                tokenCount++
                if (/^[A-G][#b]?/.test(t.trim())) chordCount++
            }

            if (tokenCount > 0 && chordCount / tokenCount > 0.3) {
                let html = ''
                for (const t of tokens) {
                    const trimmed = t.trim()
                    if (trimmed !== '' && /^[A-G][#b]?/.test(trimmed)) {
                        html += t.replace(trimmed,
                            `<span class="rounded-sm bg-amber-100 px-1 py-0 text-sm font-bold text-amber-800">${trimmed}</span>`
                        )
                    } else {
                        html += t
                    }
                }
                out.push(html)
            } else {
                out.push(line)
            }
        }
        return out.join('\n')
    }, [transposedText])

    return (
        <div className="rounded-lg bg-gray-50 p-4">
            <div className="mb-4 flex items-center justify-start gap-2">
                <button
                    onClick={() => setTransposeStep(prev => prev - 1)}
                    className="rounded-full bg-gray-200 px-4 py-1 font-bold text-gray-700 hover:bg-gray-300"
                >
                    - Tom
                </button>
                <button
                    onClick={() => setTransposeStep(prev => prev + 1)}
                    className="rounded-full bg-gray-200 px-4 py-1 font-bold text-gray-700 hover:bg-gray-300"
                >
                    + Tom
                </button>
                <button
                    onClick={() => setTransposeStep(0)}
                    className="rounded-full bg-gray-200 px-4 py-1 text-sm text-gray-700 hover:bg-gray-300"
                >
                    Resetar
                </button>
                <span className="ml-4 font-medium text-gray-800">
                    Tom: {transposeStep > 0 ? '+' : ''}{transposeStep}
                </span>
            </div>

            <pre
                className="whitespace-pre-wrap font-mono text-lg leading-relaxed text-gray-800"
                dangerouslySetInnerHTML={{ __html: renderedHtml }}
            />
        </div>
    )
}