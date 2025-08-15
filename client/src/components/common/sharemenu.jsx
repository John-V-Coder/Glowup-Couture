import { Copy, Facebook, Twitter, Mail } from "lucide-react"

export function ShareMenu({ showShareMenu, onShare, onClose }) {
  if (!showShareMenu) return null

  return (
    <div className="absolute right-0 top-12 bg-white border rounded-lg shadow-lg p-2 z-10 min-w-[150px]">
      <button
        onClick={() => onShare("copy")}
        className="flex items-center gap-2 w-full p-2 hover:bg-gray-100 rounded"
      >
        <Copy className="w-4 h-4" />
        Copy Link
      </button>
      <button
        onClick={() => onShare("facebook")}
        className="flex items-center gap-2 w-full p-2 hover:bg-gray-100 rounded"
      >
        <Facebook className="w-4 h-4" />
        Facebook
      </button>
      <button
        onClick={() => onShare("twitter")}
        className="flex items-center gap-2 w-full p-2 hover:bg-gray-100 rounded"
      >
        <Twitter className="w-4 h-4" />
        Twitter
      </button>
      <button
        onClick={() => onShare("email")}
        className="flex items-center gap-2 w-full p-2 hover:bg-gray-100 rounded"
      >
        <Mail className="w-4 h-4" />
        Email
      </button>
    </div>
  )
}