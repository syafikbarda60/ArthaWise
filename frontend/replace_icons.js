const fs = require('fs');
const path = require('path');

const filePaths = [
  "app/page.tsx",
  "app/analytics/page.tsx",
  "app/report/page.tsx",
  "app/transactions/page.tsx",
  "components/DashboardCharts.tsx",
  "components/Sidebar.tsx",
  "components/SummaryCards.tsx",
  "components/TransactionList.tsx"
].map(p => path.join('c:/file kuliah/Semester 6/DBS FOundation/capstone/frontend', p));

const iconMapping = {
  BrainCircuit: 'Psychology',
  Bell: 'Notifications',
  BarChart3: 'BarChart',
  Calendar: 'CalendarToday',
  TrendingUp: 'TrendingUp',
  TrendingDown: 'TrendingDown',
  Settings: 'Settings',
  ChevronRight: 'ChevronRight',
  ChevronLeft: 'ChevronLeft',
  CheckCircle2: 'CheckCircle',
  Info: 'Info',
  Target: 'TrackChanges',
  Zap: 'Bolt',
  ArrowUpRight: 'NorthEast',
  ArrowDownRight: 'SouthEast',
  ArrowDownLeft: 'SouthWest',
  ShieldCheck: 'GppGood',
  Sparkles: 'AutoAwesome',
  PieChart: 'PieChart',
  AlertTriangle: 'Warning',
  Lightbulb: 'Lightbulb',
  ArrowRight: 'ArrowForward',
  Activity: 'ShowChart',
  Wallet: 'AccountBalanceWallet',
  MoreVertical: 'MoreVert',
  LayoutDashboard: 'Dashboard',
  Receipt: 'ReceiptLong',
  HelpCircle: 'Help',
  Hexagon: 'Hexagon',
  Search: 'Search',
  Trash2: 'DeleteOutline',
  ExternalLink: 'OpenInNew',
  Upload: 'FileUpload',
  Plus: 'Add',
  Filter: 'FilterList',
  Download: 'FileDownload'
};

filePaths.forEach(file => {
  if (!fs.existsSync(file)) return;
  
  let content = fs.readFileSync(file, 'utf8');
  
  // Replace import source
  content = content.replace(/from\s+['"]lucide-react['"]/g, 'from "@mui/icons-material"');
  
  // Replace icon names in the file based on the mapping
  for (const [lucide, mui] of Object.entries(iconMapping)) {
    // Replace whole word matches only for the components
    const regex = new RegExp(`\\b${lucide}\\b`, 'g');
    content = content.replace(regex, mui);
  }
  
  // Replace size={X} with style={{ fontSize: X }}
  content = content.replace(/size=\{([0-9]+)\}/g, 'style={{ fontSize: $1 }}');
  
  // Special case if someone wrote size="20" (unlikely but just in case)
  content = content.replace(/size=['"]([0-9]+)['"]/g, 'style={{ fontSize: $1 }}');

  fs.writeFileSync(file, content, 'utf8');
  console.log(`Updated ${file}`);
});
