import { Progress } from '@affine/component';
import { TodayIcon, UserIcon, ViewLayersIcon } from '@blocksuite/icons/rc';
import clsx from 'clsx';

import * as styles from '../enhanced-dashboard.css';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar?: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  progress: number;
  deadline: string;
  status: 'on-track' | 'at-risk' | 'delayed' | 'completed';
  teamMembers: TeamMember[];
  priority: 'high' | 'medium' | 'low';
}

const mockProjects: Project[] = [
  {
    id: '1',
    title: 'Cancer Drug Discovery Initiative',
    description:
      'High-throughput screening of novel compounds for oncology applications',
    progress: 75,
    deadline: '2024-03-15',
    status: 'on-track',
    priority: 'high',
    teamMembers: [
      { id: '1', name: 'Dr. Sarah Chen', role: 'Lead Researcher' },
      { id: '2', name: 'Dr. Michael Torres', role: 'Biochemist' },
      { id: '3', name: 'Emily Johnson', role: 'Research Assistant' },
    ],
  },
  {
    id: '2',
    title: 'Protein Structure Elucidation',
    description:
      'X-ray crystallography and NMR analysis of therapeutic targets',
    progress: 45,
    deadline: '2024-02-28',
    status: 'at-risk',
    priority: 'high',
    teamMembers: [
      { id: '4', name: 'Dr. James Liu', role: 'Structural Biologist' },
      { id: '5', name: 'Anna Rodriguez', role: 'Crystallographer' },
    ],
  },
  {
    id: '3',
    title: 'Biomarker Validation Study',
    description:
      'Clinical validation of identified biomarkers for early diagnosis',
    progress: 90,
    deadline: '2024-01-30',
    status: 'on-track',
    priority: 'medium',
    teamMembers: [
      { id: '6', name: 'Dr. David Kim', role: 'Clinical Researcher' },
      { id: '7', name: 'Lisa Wong', role: 'Statistician' },
      { id: '8', name: 'Mark Thompson', role: 'Lab Technician' },
    ],
  },
  {
    id: '4',
    title: 'CRISPR Optimization Protocol',
    description:
      'Development of enhanced gene editing protocols for therapeutic use',
    progress: 25,
    deadline: '2024-04-10',
    status: 'delayed',
    priority: 'medium',
    teamMembers: [
      { id: '9', name: 'Dr. Maria Garcia', role: 'Molecular Biologist' },
      { id: '10', name: 'Alex Chen', role: 'Postdoc Researcher' },
    ],
  },
];

const getStatusColor = (status: Project['status']) => {
  switch (status) {
    case 'on-track':
      return 'var(--affine-success-color)';
    case 'at-risk':
      return 'var(--affine-warning-color)';
    case 'delayed':
      return 'var(--affine-error-color)';
    case 'completed':
      return 'var(--affine-success-color)';
    default:
      return 'var(--affine-text-secondary-color)';
  }
};

const getPriorityBadge = (priority: Project['priority']) => {
  const badgeClass = {
    high: styles.badgeVariants.error,
    medium: styles.badgeVariants.warning,
    low: styles.badgeVariants.neutral,
  }[priority];

  return (
    <span className={clsx(styles.badge, badgeClass)}>{priority} priority</span>
  );
};

const getDaysUntilDeadline = (deadline: string) => {
  const today = new Date();
  const deadlineDate = new Date(deadline);
  const diffTime = deadlineDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export const ActiveProjectsWidget = () => {
  return (
    <div className={clsx(styles.widget, styles.widgetSizes.large)}>
      <div className={styles.widgetHeader}>
        <h3 className={styles.widgetTitle}>
          <ViewLayersIcon className={styles.widgetIcon} />
          Active Projects
        </h3>
        <div className={styles.widgetActions}>
          <button
            className="text-sm text-gray-600 hover:text-gray-800"
            onClick={() => console.log('View all projects')}
          >
            View All
          </button>
        </div>
      </div>

      <div className={styles.widgetContent}>
        <div style={{ display: 'grid', gap: '20px' }}>
          {mockProjects.map(project => {
            const daysLeft = getDaysUntilDeadline(project.deadline);

            return (
              <div
                key={project.id}
                className={styles.listItem}
                style={{
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  padding: '16px',
                  backgroundColor: 'var(--affine-hover-color)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                }}
                onClick={() => console.log('Open project:', project.id)}
              >
                <div
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '12px',
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div
                      className={styles.listItemTitle}
                      style={{ fontSize: '16px', marginBottom: '4px' }}
                    >
                      {project.title}
                    </div>
                    <div
                      className={styles.listItemMeta}
                      style={{ marginBottom: '8px' }}
                    >
                      {project.description}
                    </div>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      gap: '8px',
                      alignItems: 'center',
                    }}
                  >
                    {getPriorityBadge(project.priority)}
                    <span
                      className={clsx(styles.badge)}
                      style={{
                        backgroundColor: getStatusColor(project.status) + '20',
                        color: getStatusColor(project.status),
                        border: `1px solid ${getStatusColor(project.status)}`,
                      }}
                    >
                      {project.status.replace('-', ' ')}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div
                  className={styles.progressContainer}
                  style={{ width: '100%', marginBottom: '12px' }}
                >
                  <div className={styles.progressLabel}>
                    <span>Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <Progress
                    value={project.progress}
                    readonly
                    style={{ height: '6px' }}
                  />
                </div>

                {/* Project Meta */}
                <div
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '12px',
                    color: 'var(--affine-text-secondary-color)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <UserIcon style={{ width: '14px', height: '14px' }} />
                      <span>{project.teamMembers.length} members</span>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <TodayIcon style={{ width: '14px', height: '14px' }} />
                      <span>
                        {daysLeft > 0
                          ? `${daysLeft} days left`
                          : daysLeft === 0
                            ? 'Due today'
                            : `${Math.abs(daysLeft)} days overdue`}
                      </span>
                    </div>
                  </div>

                  {/* Team member avatars */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    {project.teamMembers.slice(0, 3).map((member, index) => (
                      <div
                        key={member.id}
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--affine-primary-color)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '10px',
                          color: 'white',
                          fontWeight: '600',
                          marginLeft: index > 0 ? '-6px' : '0',
                          border:
                            '2px solid var(--affine-background-primary-color)',
                        }}
                        title={member.name}
                      >
                        {member.name
                          .split(' ')
                          .map(n => n[0])
                          .join('')
                          .slice(0, 2)}
                      </div>
                    ))}
                    {project.teamMembers.length > 3 && (
                      <div
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--affine-text-secondary-color)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '10px',
                          color: 'white',
                          fontWeight: '600',
                          marginLeft: '-6px',
                          border:
                            '2px solid var(--affine-background-primary-color)',
                        }}
                      >
                        +{project.teamMembers.length - 3}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
