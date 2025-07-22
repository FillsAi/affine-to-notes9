import React, { useState } from 'react';

export function AIPlaceholder() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 1000,
        backgroundColor: '#f0f0f0',
        border: '2px dashed #ccc',
        borderRadius: '8px',
        padding: '16px',
        maxWidth: '300px',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <div
        style={{
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div
          style={{
            width: '12px',
            height: '12px',
            backgroundColor: '#4CAF50',
            borderRadius: '50%',
          }}
        />
        <strong>AI Assistant (Placeholder)</strong>
        <span style={{ marginLeft: 'auto' }}>{isExpanded ? '▼' : '▶'}</span>
      </div>

      {isExpanded && (
        <div style={{ marginTop: '12px', fontSize: '14px' }}>
          <div style={{ marginBottom: '8px' }}>
            <strong>Available Features:</strong>
          </div>
          <ul style={{ margin: 0, paddingLeft: '16px' }}>
            <li>📚 Literature Intelligence Assistant</li>
            <li>📝 Smart Notebook & Data Handling</li>
            <li>⏰ Scheduling & Timers</li>
            <li>🧪 Smart LIMS with Shopping Assistant</li>
          </ul>
          <div
            style={{
              marginTop: '12px',
              padding: '8px',
              backgroundColor: '#e8f5e8',
              borderRadius: '4px',
              fontSize: '12px',
            }}
          >
            💡 AI features will be integrated from your notes9-api backend
          </div>
        </div>
      )}
    </div>
  );
}

// Hook for AI integration
export function useAIIntegration() {
  return {
    isAvailable: true,
    features: {
      literatureAssistant: true,
      smartNotebook: true,
      scheduling: true,
      smartLIMS: true,
    },
    baseUrl: 'http://localhost:8001', // Your AI API endpoint
  };
}
