import {
  CloseIcon,
  DoneIcon,
  ExperimentIcon,
  PausePanelIcon,
  ProgressIcon,
} from '@blocksuite/icons/rc';
import clsx from 'clsx';

import * as styles from '../enhanced-dashboard.css';

interface Experiment {
  id: string;
  title: string;
  status: 'in-progress' | 'completed' | 'failed' | 'on-hold';
  researcher: string;
  date: string;
  type: string;
  progress?: number;
}

const mockExperiments: Experiment[] = [
  {
    id: '1',
    title: 'Protein Crystallization - Batch #47',
    status: 'in-progress',
    researcher: 'Dr. Sarah Chen',
    date: '2024-01-15',
    type: 'Crystallography',
    progress: 65,
  },
  {
    id: '2',
    title: 'CRISPR Gene Editing - Target Validation',
    status: 'completed',
    researcher: 'Dr. Michael Torres',
    date: '2024-01-14',
    type: 'Molecular Biology',
    progress: 100,
  },
  {
    id: '3',
    title: 'Drug Screening - Compound Library #3',
    status: 'failed',
    researcher: 'Dr. Emily Johnson',
    date: '2024-01-13',
    type: 'Pharmacology',
    progress: 42,
  },
  {
    id: '4',
    title: 'Stem Cell Differentiation Protocol',
    status: 'on-hold',
    researcher: 'Dr. James Liu',
    date: '2024-01-12',
    type: 'Cell Biology',
    progress: 30,
  },
  {
    id: '5',
    title: 'Mass Spectrometry Analysis',
    status: 'in-progress',
    researcher: 'Dr. Anna Rodriguez',
    date: '2024-01-11',
    type: 'Analytical Chemistry',
    progress: 78,
  },
];

const getStatusIcon = (status: Experiment['status']) => {
  switch (status) {
    case 'completed':
      return <DoneIcon className={clsx(styles.statusColors.success)} />;
    case 'in-progress':
      return <ProgressIcon className={clsx(styles.statusColors.info)} />;
    case 'failed':
      return <CloseIcon className={clsx(styles.statusColors.error)} />;
    case 'on-hold':
      return <PausePanelIcon className={clsx(styles.statusColors.warning)} />;
  }
};

const getStatusBadge = (status: Experiment['status']) => {
  const badgeClass = {
    completed: styles.badgeVariants.success,
    'in-progress': styles.badgeVariants.primary,
    failed: styles.badgeVariants.error,
    'on-hold': styles.badgeVariants.warning,
  }[status];

  return (
    <span className={clsx(styles.badge, badgeClass)}>
      {status.replace('-', ' ')}
    </span>
  );
};

export const RecentExperimentsWidget = () => {
  return (
    <div className={clsx(styles.widget, styles.widgetSizes.medium)}>
      <div className={styles.widgetHeader}>
        <h3 className={styles.widgetTitle}>
          <ExperimentIcon className={styles.widgetIcon} />
          Recent Experiments
        </h3>
        <div className={styles.widgetActions}>
          <button
            className="text-sm text-gray-600 hover:text-gray-800"
            onClick={() => console.log('View all experiments')}
          >
            View All
          </button>
        </div>
      </div>

      <div className={styles.widgetContent}>
        {mockExperiments.map(experiment => (
          <div
            key={experiment.id}
            className={styles.listItem}
            onClick={() => console.log('Open experiment:', experiment.id)}
          >
            <div style={{ flex: 1 }}>
              <div className={styles.listItemTitle}>
                <span className={styles.statusIndicator}>
                  {getStatusIcon(experiment.status)}
                </span>
                {experiment.title}
              </div>
              <div className={styles.listItemMeta}>
                <span>{experiment.researcher}</span>
                <span>{experiment.type}</span>
                <span>{experiment.date}</span>
              </div>
              {experiment.progress && (
                <div
                  className={styles.progressContainer}
                  style={{ marginTop: '8px' }}
                >
                  <div className={styles.progressLabel}>
                    <span className={styles.progressSubLabel}>
                      Progress: {experiment.progress}%
                    </span>
                  </div>
                  <div
                    style={{
                      width: '100%',
                      height: '4px',
                      backgroundColor: 'var(--affine-border-color)',
                      borderRadius: '2px',
                    }}
                  >
                    <div
                      style={{
                        width: `${experiment.progress}%`,
                        height: '100%',
                        backgroundColor:
                          experiment.status === 'completed'
                            ? 'var(--affine-success-color)'
                            : 'var(--affine-primary-color)',
                        borderRadius: '2px',
                        transition: 'width 0.3s ease',
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
            <div>{getStatusBadge(experiment.status)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
