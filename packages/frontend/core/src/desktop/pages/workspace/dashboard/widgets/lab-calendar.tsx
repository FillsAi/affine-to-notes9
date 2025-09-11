import { DatePicker } from '@affine/component';
import {
  SettingsIcon,
  TimePanelIcon,
  TodayIcon,
  UserIcon,
} from '@blocksuite/icons/rc';
import clsx from 'clsx';
import { useState } from 'react';

import * as styles from '../enhanced-dashboard.css';

interface CalendarEvent {
  id: string;
  title: string;
  type: 'equipment-booking' | 'meeting' | 'experiment' | 'maintenance';
  startTime: string;
  endTime: string;
  date: string;
  user: string;
  location?: string;
  equipment?: string;
}

const mockEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'LC-MS/MS Analysis Session',
    type: 'equipment-booking',
    startTime: '09:00',
    endTime: '11:00',
    date: '2024-01-16',
    user: 'Dr. Sarah Chen',
    location: 'Lab A-201',
    equipment: 'LC-MS/MS System',
  },
  {
    id: '2',
    title: 'Weekly Team Meeting',
    type: 'meeting',
    startTime: '14:00',
    endTime: '15:00',
    date: '2024-01-16',
    user: 'All Team',
    location: 'Conference Room B',
  },
  {
    id: '3',
    title: 'Protein Crystallization Setup',
    type: 'experiment',
    startTime: '10:00',
    endTime: '12:00',
    date: '2024-01-17',
    user: 'Dr. James Liu',
    location: 'Lab C-301',
  },
  {
    id: '4',
    title: 'X-Ray Crystallographer Maintenance',
    type: 'maintenance',
    startTime: '08:00',
    endTime: '16:00',
    date: '2024-01-18',
    user: 'Service Technician',
    location: 'Lab C-301',
    equipment: 'X-Ray Crystallographer',
  },
  {
    id: '5',
    title: 'Flow Cytometry Analysis',
    type: 'equipment-booking',
    startTime: '13:00',
    endTime: '15:00',
    date: '2024-01-17',
    user: 'Dr. Michael Torres',
    location: 'Lab B-107',
    equipment: 'Flow Cytometer',
  },
  {
    id: '6',
    title: 'Cell Culture Media Preparation',
    type: 'experiment',
    startTime: '09:30',
    endTime: '10:30',
    date: '2024-01-19',
    user: 'Emily Johnson',
    location: 'Lab B-105',
  },
];

const getEventTypeIcon = (type: CalendarEvent['type']) => {
  switch (type) {
    case 'equipment-booking':
      return (
        <SettingsIcon
          style={{
            width: '14px',
            height: '14px',
            color: 'var(--affine-primary-color)',
          }}
        />
      );
    case 'meeting':
      return (
        <UserIcon
          style={{
            width: '14px',
            height: '14px',
            color: 'var(--affine-success-color)',
          }}
        />
      );
    case 'experiment':
      return (
        <TimePanelIcon
          style={{
            width: '14px',
            height: '14px',
            color: 'var(--affine-processing-color)',
          }}
        />
      );
    case 'maintenance':
      return (
        <SettingsIcon
          style={{
            width: '14px',
            height: '14px',
            color: 'var(--affine-warning-color)',
          }}
        />
      );
  }
};

const getEventTypeColor = (type: CalendarEvent['type']) => {
  switch (type) {
    case 'equipment-booking':
      return 'var(--affine-primary-color)';
    case 'meeting':
      return 'var(--affine-success-color)';
    case 'experiment':
      return 'var(--affine-processing-color)';
    case 'maintenance':
      return 'var(--affine-warning-color)';
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
};

export const LabCalendarWidget = () => {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  const today = new Date().toISOString().split('T')[0];
  const upcomingEvents = mockEvents
    .filter(event => event.date >= today)
    .sort((a, b) => {
      if (a.date !== b.date) {
        return a.date.localeCompare(b.date);
      }
      return a.startTime.localeCompare(b.startTime);
    })
    .slice(0, 5);

  const todayEvents = mockEvents.filter(event => event.date === today);

  return (
    <div className={clsx(styles.widget, styles.widgetSizes.large)}>
      <div className={styles.widgetHeader}>
        <h3 className={styles.widgetTitle}>
          <TodayIcon className={styles.widgetIcon} />
          Lab Calendar
        </h3>
        <div className={styles.widgetActions}>
          <button
            className="text-sm text-gray-600 hover:text-gray-800"
            onClick={() => console.log('View full calendar')}
          >
            Full Calendar
          </button>
        </div>
      </div>

      <div
        className={styles.widgetContent}
        style={{ display: 'flex', gap: '20px' }}
      >
        {/* Mini Calendar */}
        <div style={{ flex: 1, minWidth: '200px' }}>
          <div className={styles.calendarContainer}>
            <DatePicker
              value={selectedDate}
              onChange={date => setSelectedDate(date)}
              cellSize={32}
              gapX={4}
              gapY={4}
              customDayRenderer={cell => {
                const dateStr = cell.date.format('YYYY-MM-DD');
                const dayEvents = mockEvents.filter(
                  event => event.date === dateStr
                );
                const hasEvents = dayEvents.length > 0;

                return (
                  <div
                    style={{
                      position: 'relative',
                      width: '100%',
                      height: '100%',
                    }}
                  >
                    <span>{cell.label}</span>
                    {hasEvents && (
                      <div
                        style={{
                          position: 'absolute',
                          bottom: '2px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          display: 'flex',
                          gap: '2px',
                        }}
                      >
                        {dayEvents.slice(0, 3).map((event, _index) => (
                          <div
                            key={event.id}
                            style={{
                              width: '4px',
                              height: '4px',
                              borderRadius: '50%',
                              backgroundColor: getEventTypeColor(event.type),
                            }}
                          />
                        ))}
                        {dayEvents.length > 3 && (
                          <div
                            style={{
                              width: '4px',
                              height: '4px',
                              borderRadius: '50%',
                              backgroundColor:
                                'var(--affine-text-secondary-color)',
                            }}
                          />
                        )}
                      </div>
                    )}
                  </div>
                );
              }}
            />
          </div>
        </div>

        {/* Events List */}
        <div style={{ flex: 1, minWidth: '250px' }}>
          {/* Today's Events */}
          {todayEvents.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginBottom: '12px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: 'var(--affine-text-primary-color)',
                }}
              >
                <TodayIcon style={{ width: '16px', height: '16px' }} />
                Today&apos;s Events
              </div>

              {todayEvents.map(event => (
                <div
                  key={event.id}
                  className={styles.listItem}
                  style={{
                    padding: '8px 12px',
                    marginBottom: '8px',
                    backgroundColor: 'var(--affine-hover-color)',
                    borderRadius: '6px',
                    borderLeft: `4px solid ${getEventTypeColor(event.type)}`,
                  }}
                  onClick={() => console.log('Open event:', event.id)}
                >
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        marginBottom: '4px',
                      }}
                    >
                      {getEventTypeIcon(event.type)}
                      <span
                        className={styles.listItemTitle}
                        style={{ fontSize: '13px' }}
                      >
                        {event.title}
                      </span>
                    </div>

                    <div className={styles.listItemMeta} style={{ gap: '8px' }}>
                      <span>
                        {event.startTime} - {event.endTime}
                      </span>
                      {event.location && <span>{event.location}</span>}
                      <span>{event.user}</span>
                    </div>

                    {event.equipment && (
                      <div
                        style={{
                          fontSize: '11px',
                          color: 'var(--affine-text-secondary-color)',
                          marginTop: '2px',
                        }}
                      >
                        Equipment: {event.equipment}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Upcoming Events */}
          <div>
            <div
              style={{
                fontSize: '14px',
                fontWeight: '600',
                color: 'var(--affine-text-primary-color)',
                marginBottom: '12px',
              }}
            >
              Upcoming Events
            </div>

            {upcomingEvents.map(event => (
              <div
                key={event.id}
                className={styles.listItem}
                style={{
                  padding: '8px 12px',
                  marginBottom: '8px',
                  backgroundColor: 'var(--affine-background-primary-color)',
                  border: '1px solid var(--affine-border-color)',
                  borderRadius: '6px',
                  borderLeft: `4px solid ${getEventTypeColor(event.type)}`,
                }}
                onClick={() => console.log('Open event:', event.id)}
              >
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      marginBottom: '4px',
                    }}
                  >
                    {getEventTypeIcon(event.type)}
                    <span
                      className={styles.listItemTitle}
                      style={{ fontSize: '13px' }}
                    >
                      {event.title}
                    </span>
                  </div>

                  <div className={styles.listItemMeta} style={{ gap: '8px' }}>
                    <span>{formatDate(event.date)}</span>
                    <span>
                      {event.startTime} - {event.endTime}
                    </span>
                    {event.location && <span>{event.location}</span>}
                  </div>

                  <div
                    style={{
                      fontSize: '11px',
                      color: 'var(--affine-text-secondary-color)',
                      marginTop: '2px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span>{event.user}</span>
                    {event.equipment && (
                      <span style={{ fontStyle: 'italic' }}>
                        {event.equipment}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div
            style={{
              marginTop: '16px',
              padding: '12px',
              backgroundColor: 'var(--affine-hover-color)',
              borderRadius: '6px',
              fontSize: '12px',
            }}
          >
            <div style={{ marginBottom: '8px', fontWeight: '500' }}>
              Quick Actions:
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                style={{
                  color: 'var(--affine-primary-color)',
                  textDecoration: 'none',
                  cursor: 'pointer',
                  border: 'none',
                  background: 'none',
                  fontSize: '12px',
                }}
                onClick={() => console.log('Book equipment')}
              >
                Book Equipment
              </button>
              <button
                style={{
                  color: 'var(--affine-primary-color)',
                  textDecoration: 'none',
                  cursor: 'pointer',
                  border: 'none',
                  background: 'none',
                  fontSize: '12px',
                }}
                onClick={() => console.log('Schedule meeting')}
              >
                Schedule Meeting
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
