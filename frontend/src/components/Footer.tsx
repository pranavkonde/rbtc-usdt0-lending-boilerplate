import { motion } from 'framer-motion'
import { Github, ExternalLink, Heart } from 'lucide-react'

export function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="mt-auto py-8 px-4"
    >
      <div className="max-w-7xl mx-auto">
        <div className="glass-card p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-rsk-muted">
            <span>Built with</span>
            <Heart className="w-4 h-4 text-red-400 fill-red-400" />
            <span>on</span>
            <span className="text-gradient font-semibold">Rootstock</span>
          </div>
          
          <div className="flex items-center gap-6">
            <a
              href="https://rootstock.io"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-rsk-muted hover:text-white transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span className="text-sm">Rootstock</span>
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-rsk-muted hover:text-white transition-colors"
            >
              <Github className="w-4 h-4" />
              <span className="text-sm">GitHub</span>
            </a>
          </div>

          <p className="text-xs text-rsk-muted">
            Educational boilerplate. NOT for production use.
          </p>
        </div>
      </div>
    </motion.footer>
  )
}
