import {
  CloseIcon,
  MicrophoneIcon,
  PenIcon,
  PlusIcon,
  SaveIcon,
  TagIcon,
} from '@blocksuite/icons/rc';
import clsx from 'clsx';
import { useCallback, useEffect, useState } from 'react';

import * as styles from '../enhanced-dashboard.css';

interface Note {
  id: string;
  content: string;
  tags: string[];
  timestamp: string;
  author: string;
}

const mockNotes: Note[] = [
  {
    id: '1',
    content:
      "Remember to check pH levels in buffer solutions before tomorrow's protein purification experiment.",
    tags: ['experiment', 'protein-purification', 'buffer-prep'],
    timestamp: '2024-01-15T14:30:00Z',
    author: 'Dr. Sarah Chen',
  },
  {
    id: '2',
    content:
      'New batch of cell culture media shows better growth rates. Consider switching protocol permanently.',
    tags: ['cell-culture', 'protocol-update', 'media-optimization'],
    timestamp: '2024-01-15T10:15:00Z',
    author: 'Emily Johnson',
  },
  {
    id: '3',
    content:
      'Equipment booking system updated. New time slots available for LC-MS starting next week.',
    tags: ['equipment', 'booking', 'lc-ms'],
    timestamp: '2024-01-14T16:45:00Z',
    author: 'Lab Coordinator',
  },
];

const commonTags = [
  'experiment',
  'protocol',
  'equipment',
  'safety',
  'maintenance',
  'cell-culture',
  'analysis',
  'meeting-notes',
  'todo',
  'important',
];

const getTimeAgo = (timestamp: string) => {
  const now = new Date();
  const noteTime = new Date(timestamp);
  const diffInMs = now.getTime() - noteTime.getTime();
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInHours < 1) {
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    return `${diffInMinutes} min ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  } else {
    return `${diffInDays}d ago`;
  }
};

export const QuickNotesWidget = () => {
  const [newNote, setNewNote] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState('');
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState('');

  // Auto-save simulation
  useEffect(() => {
    if (newNote.length > 0) {
      const timeoutId = setTimeout(() => {
        setAutoSaveStatus('Draft saved');
        setTimeout(() => setAutoSaveStatus(''), 2000);
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [newNote]);

  const handleAddTag = useCallback(
    (tag: string) => {
      if (tag && !selectedTags.includes(tag)) {
        setSelectedTags(prev => [...prev, tag]);
      }
    },
    [selectedTags]
  );

  const handleRemoveTag = useCallback((tag: string) => {
    setSelectedTags(prev => prev.filter(t => t !== tag));
  }, []);

  const handleAddCustomTag = useCallback(() => {
    if (customTag.trim()) {
      handleAddTag(customTag.trim().toLowerCase());
      setCustomTag('');
      setIsAddingTag(false);
    }
  }, [customTag, handleAddTag]);

  const handleSaveNote = useCallback(() => {
    if (newNote.trim()) {
      const note: Note = {
        id: Date.now().toString(),
        content: newNote.trim(),
        tags: selectedTags,
        timestamp: new Date().toISOString(),
        author: 'Current User',
      };

      console.log('Saving note:', note);

      // Reset form
      setNewNote('');
      setSelectedTags([]);
      setAutoSaveStatus('Note saved successfully!');
      setTimeout(() => setAutoSaveStatus(''), 3000);
    }
  }, [newNote, selectedTags]);

  const handleVoiceRecord = useCallback(() => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      // Simulate voice recording
      console.log('Starting voice recording...');
      setTimeout(() => {
        setNewNote(
          'Voice recording transcribed: Sample note content from voice input.'
        );
        setIsRecording(false);
      }, 3000);
    }
  }, [isRecording]);

  return (
    <div className={clsx(styles.widget, styles.widgetSizes.medium)}>
      <div className={styles.widgetHeader}>
        <h3 className={styles.widgetTitle}>
          <PenIcon className={styles.widgetIcon} />
          Quick Notes
        </h3>
        <div className={styles.widgetActions}>
          {autoSaveStatus && (
            <span
              style={{
                fontSize: '11px',
                color: 'var(--affine-success-color)',
                fontStyle: 'italic',
              }}
            >
              {autoSaveStatus}
            </span>
          )}
        </div>
      </div>

      <div className={styles.widgetContent}>
        {/* Note Input Area */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ position: 'relative' }}>
            <textarea
              className={styles.noteArea}
              placeholder="Write a quick note... (auto-saves as you type)"
              value={newNote}
              onChange={e => setNewNote(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && e.ctrlKey) {
                  handleSaveNote();
                }
              }}
            />

            {/* Voice Recording Button */}
            <button
              style={{
                position: 'absolute',
                bottom: '8px',
                right: '8px',
                background: isRecording
                  ? 'var(--affine-error-color)'
                  : 'var(--affine-primary-color)',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onClick={handleVoiceRecord}
              title={isRecording ? 'Stop recording' : 'Voice to text'}
            >
              <MicrophoneIcon
                style={{
                  width: '14px',
                  height: '14px',
                  animation: isRecording ? 'pulse 1s infinite' : 'none',
                }}
              />
            </button>
          </div>

          {/* Tag Selection */}
          <div style={{ marginTop: '12px' }}>
            <div
              style={{
                fontSize: '12px',
                color: 'var(--affine-text-secondary-color)',
                marginBottom: '8px',
              }}
            >
              Tags:
            </div>

            {/* Selected Tags */}
            {selectedTags.length > 0 && (
              <div
                className={styles.tagContainer}
                style={{ marginBottom: '8px' }}
              >
                {selectedTags.map(tag => (
                  <span key={tag} className={styles.tag}>
                    #{tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--affine-text-secondary-color)',
                        cursor: 'pointer',
                        padding: '0',
                        marginLeft: '4px',
                      }}
                    >
                      <CloseIcon style={{ width: '10px', height: '10px' }} />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Common Tags */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '6px',
                marginBottom: '8px',
              }}
            >
              {commonTags
                .filter(tag => !selectedTags.includes(tag))
                .slice(0, 6)
                .map(tag => (
                  <button
                    key={tag}
                    onClick={() => handleAddTag(tag)}
                    style={{
                      background: 'none',
                      border: `1px solid var(--affine-border-color)`,
                      color: 'var(--affine-text-secondary-color)',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.backgroundColor =
                        'var(--affine-hover-color)';
                      e.currentTarget.style.borderColor =
                        'var(--affine-primary-color)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.borderColor =
                        'var(--affine-border-color)';
                    }}
                  >
                    #{tag}
                  </button>
                ))}

              {/* Add Custom Tag */}
              {isAddingTag ? (
                <div
                  style={{ display: 'flex', gap: '4px', alignItems: 'center' }}
                >
                  <input
                    type="text"
                    placeholder="custom tag"
                    value={customTag}
                    onChange={e => setCustomTag(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        handleAddCustomTag();
                      } else if (e.key === 'Escape') {
                        setIsAddingTag(false);
                        setCustomTag('');
                      }
                    }}
                    style={{
                      border: '1px solid var(--affine-primary-color)',
                      borderRadius: '4px',
                      padding: '4px 6px',
                      fontSize: '11px',
                      width: '80px',
                      outline: 'none',
                    }}
                    autoFocus
                  />
                  <button
                    onClick={handleAddCustomTag}
                    style={{
                      background: 'var(--affine-success-color)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '3px',
                      width: '20px',
                      height: '20px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <SaveIcon style={{ width: '10px', height: '10px' }} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsAddingTag(true)}
                  style={{
                    background: 'none',
                    border: `1px dashed var(--affine-border-color)`,
                    color: 'var(--affine-text-secondary-color)',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <PlusIcon style={{ width: '10px', height: '10px' }} />
                  Add tag
                </button>
              )}
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSaveNote}
            disabled={!newNote.trim()}
            style={{
              background: newNote.trim()
                ? 'var(--affine-primary-color)'
                : 'var(--affine-text-disable-color)',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '8px 16px',
              fontSize: '12px',
              cursor: newNote.trim() ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              width: '100%',
              justifyContent: 'center',
              transition: 'background-color 0.2s ease',
            }}
          >
            <SaveIcon style={{ width: '14px', height: '14px' }} />
            Save Note (Ctrl+Enter)
          </button>
        </div>

        {/* Recent Notes */}
        <div>
          <div
            style={{
              fontSize: '14px',
              fontWeight: '600',
              color: 'var(--affine-text-primary-color)',
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <TagIcon style={{ width: '14px', height: '14px' }} />
            Recent Notes
          </div>

          <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {mockNotes.map(note => (
              <div
                key={note.id}
                className={styles.listItem}
                style={{
                  padding: '12px',
                  marginBottom: '8px',
                  backgroundColor: 'var(--affine-background-primary-color)',
                  border: '1px solid var(--affine-border-color)',
                  borderRadius: '6px',
                  cursor: 'pointer',
                }}
                onClick={() => console.log('Open note:', note.id)}
              >
                <div style={{ marginBottom: '8px' }}>
                  <div
                    style={{
                      fontSize: '13px',
                      lineHeight: '1.4',
                      color: 'var(--affine-text-primary-color)',
                      marginBottom: '6px',
                    }}
                  >
                    {note.content}
                  </div>

                  {note.tags.length > 0 && (
                    <div className={styles.tagContainer}>
                      {note.tags.map(tag => (
                        <span
                          key={tag}
                          className={styles.tag}
                          style={{ fontSize: '10px' }}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div
                  style={{
                    fontSize: '11px',
                    color: 'var(--affine-text-secondary-color)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span>{note.author}</span>
                  <span>{getTimeAgo(note.timestamp)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
