import { Component } from 'react';
import { motion } from 'framer-motion';

export class MLOErrorBoundary extends Component {
  state = { hasError: false, error: null };
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <motion.div 
          className="rounded-3xl glass border border-rose-500/20 p-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="text-rose-400 text-4xl mb-4">⚠️</div>
          <h3 className="text-white font-bold mb-2">Oracle Disconnected</h3>
          <p className="text-white/40 text-sm mb-4">
            Reconnecting to BSC node...
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-white/5 hover:bg-white/10 rounded-full text-white text-sm transition-all"
          >
            Retry Connection
          </button>
        </motion.div>
      );
    }
    return this.props.children;
  }
}