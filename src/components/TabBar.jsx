export default function TabBar({ activeTab, onChange }) {
  const tabs = [
    { id: 'today', icon: '🎯', label: '오늘' },
    { id: 'map',   icon: '🗺',  label: '지도' },
    { id: 'records', icon: '📋', label: '기록' },
  ];

  return (
    <nav className="tab-bar">
      {tabs.map(t => (
        <button
          key={t.id}
          className={`tab-item ${activeTab === t.id ? 'active' : ''}`}
          onClick={() => onChange(t.id)}
        >
          <span className="tab-icon">{t.icon}</span>
          <span className="tab-label">{t.label}</span>
          {activeTab === t.id && <span className="tab-indicator" />}
        </button>
      ))}
    </nav>
  );
}
