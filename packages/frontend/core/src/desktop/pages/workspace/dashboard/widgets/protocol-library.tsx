import {
  FileIcon,
  HistoryIcon,
  LockIcon,
  PlusIcon,
  PublishIcon,
  SearchIcon,
  ShareIcon,
  TeamWorkspaceIcon,
} from '@blocksuite/icons/rc';
import clsx from 'clsx';

import * as styles from '../enhanced-dashboard.css';

interface Protocol {
  id: string;
  title: string;
  description: string;
  version: string;
  lastModified: string;
  author: string;
  sharingStatus: 'private' | 'team' | 'public';
  category: string;
  usageCount: number;
  lastUsed?: string;
  tags: string[];
}

const mockProtocols: Protocol[] = [
  {
    id: '1',
    title: 'Protein Purification via Ni-NTA Affinity Chromatography',
    description:
      'Standard protocol for purifying His-tagged recombinant proteins using nickel-based affinity chromatography.',
    version: 'v2.1',
    lastModified: '2024-01-10',
    author: 'Dr. Sarah Chen',
    sharingStatus: 'team',
    category: 'Protein Biochemistry',
    usageCount: 15,
    lastUsed: '2024-01-14',
    tags: ['protein-purification', 'chromatography', 'his-tag'],
  },
  {
    id: '2',
    title: 'CRISPR-Cas9 Gene Editing in HEK293 Cells',
    description:
      'Optimized protocol for CRISPR-mediated gene knockouts in human embryonic kidney cells.',
    version: 'v3.0',
    lastModified: '2024-01-08',
    author: 'Dr. Michael Torres',
    sharingStatus: 'public',
    category: 'Molecular Biology',
    usageCount: 28,
    lastUsed: '2024-01-12',
    tags: ['crispr', 'gene-editing', 'cell-culture'],
  },
  {
    id: '3',
    title: 'Western Blot Analysis - Enhanced Sensitivity',
    description:
      'High-sensitivity western blotting protocol with optimized blocking and detection steps.',
    version: 'v1.5',
    lastModified: '2024-01-05',
    author: 'Emily Johnson',
    sharingStatus: 'team',
    category: 'Analytical',
    usageCount: 22,
    lastUsed: '2024-01-11',
    tags: ['western-blot', 'protein-analysis', 'detection'],
  },
  {
    id: '4',
    title: 'Cell Viability Assay (MTT)',
    description:
      'Standardized MTT assay for measuring metabolic activity and cell viability in 96-well format.',
    version: 'v2.0',
    lastModified: '2024-01-03',
    author: 'Dr. James Liu',
    sharingStatus: 'private',
    category: 'Cell Biology',
    usageCount: 8,
    lastUsed: '2024-01-09',
    tags: ['cell-viability', 'assay', 'mtt'],
  },
  {
    id: '5',
    title: 'RNA Extraction from Mammalian Cells',
    description:
      'TRIzol-based RNA extraction protocol with DNase treatment for downstream qPCR analysis.',
    version: 'v1.2',
    lastModified: '2023-12-28',
    author: 'Anna Rodriguez',
    sharingStatus: 'public',
    category: 'Molecular Biology',
    usageCount: 31,
    lastUsed: '2024-01-13',
    tags: ['rna-extraction', 'trizol', 'qpcr'],
  },
];

const getSharingIcon = (status: Protocol['sharingStatus']) => {
  switch (status) {
    case 'private':
      return (
        <LockIcon
          style={{
            width: '14px',
            height: '14px',
            color: 'var(--affine-text-secondary-color)',
          }}
        />
      );
    case 'team':
      return (
        <TeamWorkspaceIcon
          style={{
            width: '14px',
            height: '14px',
            color: 'var(--affine-warning-color)',
          }}
        />
      );
    case 'public':
      return (
        <PublishIcon
          style={{
            width: '14px',
            height: '14px',
            color: 'var(--affine-success-color)',
          }}
        />
      );
  }
};

const getSharingBadge = (status: Protocol['sharingStatus']) => {
  const badgeClass = {
    private: styles.badgeVariants.neutral,
    team: styles.badgeVariants.warning,
    public: styles.badgeVariants.success,
  }[status];

  return <span className={clsx(styles.badge, badgeClass)}>{status}</span>;
};

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    'Protein Biochemistry': 'var(--affine-tag-blue)',
    'Molecular Biology': 'var(--affine-tag-green)',
    Analytical: 'var(--affine-tag-purple)',
    'Cell Biology': 'var(--affine-tag-orange)',
  };
  return colors[category] || 'var(--affine-text-secondary-color)';
};

const getTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInDays = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return '1 day ago';
  if (diffInDays < 30) return `${diffInDays} days ago`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
  return `${Math.floor(diffInDays / 365)} years ago`;
};

export const ProtocolLibraryWidget = () => {
  const recentlyUsedProtocols = mockProtocols
    .filter(protocol => protocol.lastUsed)
    .sort(
      (a, b) =>
        new Date(b.lastUsed || 0).getTime() -
        new Date(a.lastUsed || 0).getTime()
    )
    .slice(0, 3);

  const mostPopularProtocols = [...mockProtocols]
    .sort((a, b) => b.usageCount - a.usageCount)
    .slice(0, 2);

  return (
    <div className={clsx(styles.widget, styles.widgetSizes.large)}>
      <div className={styles.widgetHeader}>
        <h3 className={styles.widgetTitle}>
          <FileIcon className={styles.widgetIcon} />
          Protocol Library
        </h3>
        <div
          className={styles.widgetActions}
          style={{ display: 'flex', gap: '8px' }}
        >
          <button
            className="text-sm text-gray-600 hover:text-gray-800"
            onClick={() => console.log('Search protocols')}
          >
            <SearchIcon style={{ width: '16px', height: '16px' }} />
          </button>
          <button
            className="text-sm text-gray-600 hover:text-gray-800"
            onClick={() => console.log('Create new protocol')}
          >
            <PlusIcon style={{ width: '16px', height: '16px' }} />
          </button>
          <button
            className="text-sm text-gray-600 hover:text-gray-800"
            onClick={() => console.log('View all protocols')}
          >
            View All
          </button>
        </div>
      </div>

      <div className={styles.widgetContent}>
        {/* Recently Used Protocols */}
        <div style={{ marginBottom: '24px' }}>
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
            <HistoryIcon style={{ width: '16px', height: '16px' }} />
            Recently Used
          </div>

          <div style={{ display: 'grid', gap: '12px' }}>
            {recentlyUsedProtocols.map(protocol => (
              <div
                key={protocol.id}
                className={styles.listItem}
                style={{
                  padding: '12px 16px',
                  backgroundColor: 'var(--affine-hover-color)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  border: '1px solid transparent',
                  transition: 'all 0.2s ease',
                }}
                onClick={() => console.log('Open protocol:', protocol.id)}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor =
                    'var(--affine-primary-color)';
                  e.currentTarget.style.backgroundColor =
                    'var(--affine-background-primary-color)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'transparent';
                  e.currentTarget.style.backgroundColor =
                    'var(--affine-hover-color)';
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <FileIcon
                      style={{
                        width: '16px',
                        height: '16px',
                        color: 'var(--affine-primary-color)',
                      }}
                    />
                  </div>

                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        marginBottom: '4px',
                      }}
                    >
                      <div
                        className={styles.listItemTitle}
                        style={{ fontSize: '14px' }}
                      >
                        {protocol.title}
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          marginLeft: '12px',
                        }}
                      >
                        {getSharingIcon(protocol.sharingStatus)}
                        <span
                          style={{
                            fontSize: '11px',
                            color: 'var(--affine-text-secondary-color)',
                          }}
                        >
                          {protocol.version}
                        </span>
                      </div>
                    </div>

                    <div
                      className={styles.listItemMeta}
                      style={{ marginBottom: '8px', lineHeight: '1.4' }}
                    >
                      {protocol.description}
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          fontSize: '11px',
                          color: 'var(--affine-text-secondary-color)',
                        }}
                      >
                        <span
                          style={{
                            color: getCategoryColor(protocol.category),
                            fontWeight: '500',
                          }}
                        >
                          {protocol.category}
                        </span>
                        <span>{protocol.author}</span>
                        <span>{protocol.usageCount} uses</span>
                        {protocol.lastUsed && (
                          <span>
                            Last used: {getTimeAgo(protocol.lastUsed)}
                          </span>
                        )}
                      </div>

                      {getSharingBadge(protocol.sharingStatus)}
                    </div>

                    {/* Tags */}
                    {protocol.tags.length > 0 && (
                      <div
                        className={styles.tagContainer}
                        style={{ marginTop: '8px' }}
                      >
                        {protocol.tags.slice(0, 3).map(tag => (
                          <span
                            key={tag}
                            className={styles.tag}
                            style={{ fontSize: '10px' }}
                          >
                            #{tag}
                          </span>
                        ))}
                        {protocol.tags.length > 3 && (
                          <span
                            className={styles.tag}
                            style={{ fontSize: '10px' }}
                          >
                            +{protocol.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Most Popular Protocols */}
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
            <ShareIcon style={{ width: '16px', height: '16px' }} />
            Most Popular
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
            }}
          >
            {mostPopularProtocols.map(protocol => (
              <div
                key={protocol.id}
                style={{
                  padding: '12px',
                  backgroundColor: 'var(--affine-background-primary-color)',
                  border: '1px solid var(--affine-border-color)',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onClick={() => console.log('Open protocol:', protocol.id)}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor =
                    'var(--affine-primary-color)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor =
                    'var(--affine-border-color)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginBottom: '6px',
                  }}
                >
                  <FileIcon
                    style={{
                      width: '14px',
                      height: '14px',
                      color: 'var(--affine-primary-color)',
                    }}
                  />
                  <span
                    style={{
                      fontSize: '13px',
                      fontWeight: '500',
                      flex: 1,
                      lineHeight: '1.3',
                    }}
                  >
                    {protocol.title}
                  </span>
                </div>

                <div
                  style={{
                    fontSize: '11px',
                    color: 'var(--affine-text-secondary-color)',
                    marginBottom: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span>{protocol.usageCount} uses</span>
                  <span style={{ color: getCategoryColor(protocol.category) }}>
                    {protocol.category}
                  </span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span
                    style={{
                      fontSize: '10px',
                      color: 'var(--affine-text-secondary-color)',
                    }}
                  >
                    {protocol.author} • {protocol.version}
                  </span>
                  {getSharingIcon(protocol.sharingStatus)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div
          style={{
            padding: '12px',
            backgroundColor: 'var(--affine-hover-color)',
            borderRadius: '6px',
            fontSize: '12px',
          }}
        >
          <div style={{ marginBottom: '8px', fontWeight: '500' }}>
            Quick Actions:
          </div>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <button
              style={{
                color: 'var(--affine-primary-color)',
                textDecoration: 'none',
                cursor: 'pointer',
                border: 'none',
                background: 'none',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
              onClick={() => console.log('Create new protocol')}
            >
              <PlusIcon style={{ width: '12px', height: '12px' }} />
              New Protocol
            </button>
            <button
              style={{
                color: 'var(--affine-primary-color)',
                textDecoration: 'none',
                cursor: 'pointer',
                border: 'none',
                background: 'none',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
              onClick={() => console.log('Browse by category')}
            >
              <FileIcon style={{ width: '12px', height: '12px' }} />
              Browse Categories
            </button>
            <button
              style={{
                color: 'var(--affine-primary-color)',
                textDecoration: 'none',
                cursor: 'pointer',
                border: 'none',
                background: 'none',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
              onClick={() => console.log('View shared protocols')}
            >
              <ShareIcon style={{ width: '12px', height: '12px' }} />
              Team Protocols
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
