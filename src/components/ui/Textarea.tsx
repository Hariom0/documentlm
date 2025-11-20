import * as React from "react"
import { FileText } from "lucide-react"

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  characterCount?: number
  maxCharacters?: number
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, characterCount = 0, maxCharacters = 10000, ...props }, ref) => {
    const baseClasses = "min-h-[200px] max-w-3xl w-full rounded-md border border-slate-400/80 bg-white/30 px-4 py-3 text-sm text-gray-700 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-transparent focus:bg-white/80 disabled:cursor-not-allowed disabled:opacity-50 resize-none transition-all"

    const classes = className
      ? `${baseClasses} ${className}`
      : baseClasses

    return (
      <div className="w-full max-w-3xl bg-gradient-to-br from-blue-100/70 to-blue-200 rounded-xl border border-blue-200/50 shadow-lg p-6 mx-auto m-2">
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-5 h-5 text-blue-700" />
            <h2 className="text-lg font-semibold text-gray-800">Or Paste Your Text</h2>
          </div>
          <p className="text-sm text-gray-600">Paste your notes directly for quick processing</p>
        </div>

        {/* Textarea */}
        <textarea
          className={classes}
          ref={ref}
          {...props}
          placeholder="For example:
          Photosynthesis is the process by which plants convert light energy into chemical energy. This process occurs in the chloroplasts of plant cells and involves the absorption of carbon dioxide from the atmosphere and water from the soil. The main product is glucose, which plants use for energy, and oxygen is released as a byproduct.."
        />

        {/* Character Count */}
        <div className="mt-3 text-xs text-gray-500">
          {characterCount.toLocaleString()} / {maxCharacters.toLocaleString()} characters
        </div>
      </div>
    )
  }
)

Textarea.displayName = "Textarea"

export default Textarea 