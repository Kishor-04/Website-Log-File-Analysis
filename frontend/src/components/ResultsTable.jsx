import React, { useState, useMemo } from "react";

const ResultsTable = ({ data }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [filterConfig, setFilterConfig] = useState({ anomaliesOnly: false, statusFilter: 'all' });
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 50;

  // Filter and search data
  const filteredData = useMemo(() => {
    let filtered = data.filter(row => {
      const matchesSearch = searchTerm === '' || 
        row.ip.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.timestamp.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesAnomalyFilter = !filterConfig.anomaliesOnly || row.anomaly === -1;
      
      const matchesStatusFilter = filterConfig.statusFilter === 'all' || 
        row.status.toString().startsWith(filterConfig.statusFilter);
      
      return matchesSearch && matchesAnomalyFilter && matchesStatusFilter;
    });

    // Sort data - FIXED: CREATE A COPY FIRST
    if (sortConfig.key) {
      filtered = [...filtered].sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];
        
        // Convert to number if possible for proper sorting
        if (!isNaN(aValue) && !isNaN(bValue)) {
          aValue = Number(aValue);
          bValue = Number(bValue);
        }
        
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [data, sortConfig, filterConfig, searchTerm]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (columnName) => {
    if (sortConfig.key !== columnName) return '↕️';
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  const getStatusBadgeColor = (status) => {
    const statusStr = String(status);
    if (statusStr.startsWith('2')) return '#10b981'; // Success - Green
    if (statusStr.startsWith('3')) return '#3b82f6'; // Redirect - Blue
    if (statusStr.startsWith('4')) return '#f59e0b'; // Client Error - Yellow
    if (statusStr.startsWith('5')) return '#ef4444'; // Server Error - Red
    return '#6b7280'; // Default - Gray
  };

  const formatTimestamp = (timestamp) => {
    try {
      return new Date(timestamp).toLocaleString();
    } catch {
      return timestamp;
    }
  };

  const formatSize = (size) => {
    const bytes = parseInt(size);
    if (isNaN(bytes)) return size;
    
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Timestamp', 'IP Address', 'Status', 'Size', 'Anomaly'],
      ...filteredData.map(row => [
        row.timestamp,
        row.ip,
        row.status,
        row.size,
        row.anomaly === -1 ? 'Yes' : 'No'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `log_analysis_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="table-container">
      {/* Controls */}
      <div className="table-controls">
        <div className="controls-row">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search by IP or timestamp..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>
          
          <div className="filters">
            <label className="filter-checkbox">
              <input
                type="checkbox"
                checked={filterConfig.anomaliesOnly}
                onChange={(e) => {
                  setFilterConfig({ ...filterConfig, anomaliesOnly: e.target.checked });
                  setCurrentPage(1);
                }}
              />
              <span>Show anomalies only</span>
            </label>
            
            <select
              value={filterConfig.statusFilter}
              onChange={(e) => {
                setFilterConfig({ ...filterConfig, statusFilter: e.target.value });
                setCurrentPage(1);
              }}
              className="status-filter"
            >
              <option value="all">All Status Codes</option>
              <option value="2">2xx Success</option>
              <option value="3">3xx Redirect</option>
              <option value="4">4xx Client Error</option>
              <option value="5">5xx Server Error</option>
            </select>
          </div>
        </div>

        <div className="controls-row">
          <div className="results-info">
            Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredData.length)} of {filteredData.length} results
            {filteredData.length !== data.length && ` (filtered from ${data.length} total)`}
          </div>
          
          <button onClick={exportToCSV} className="export-button">
            📥 Export CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="table-wrapper">
        <table className="results-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('timestamp')} className="sortable">
                Timestamp {getSortIcon('timestamp')}
              </th>
              <th onClick={() => handleSort('ip')} className="sortable">
                IP Address {getSortIcon('ip')}
              </th>
              <th onClick={() => handleSort('status')} className="sortable">
                Status {getSortIcon('status')}
              </th>
              <th onClick={() => handleSort('size')} className="sortable">
                Size {getSortIcon('size')}
              </th>
              <th onClick={() => handleSort('anomaly')} className="sortable">
                Anomaly {getSortIcon('anomaly')}
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, index) => (
              <tr key={index} className={row.anomaly === -1 ? 'anomaly-row' : 'normal-row'}>
                <td className="timestamp-cell">{formatTimestamp(row.timestamp)}</td>
                <td className="ip-cell">
                  <code>{row.ip}</code>
                </td>
                <td className="status-cell">
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusBadgeColor(row.status) }}
                  >
                    {row.status}
                  </span>
                </td>
                <td className="size-cell">{formatSize(row.size)}</td>
                <td className="anomaly-cell">
                  <span className={`anomaly-indicator ${row.anomaly === -1 ? 'is-anomaly' : 'is-normal'}`}>
                    {row.anomaly === -1 ? '⚠️ Yes' : '✅ No'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {paginatedData.length === 0 && (
          <div className="no-results">
            <div className="no-results-icon">🔍</div>
            <h3>No results found</h3>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="pagination-button"
          >
            ← Previous
          </button>
          
          <div className="page-numbers">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`page-number ${currentPage === pageNum ? 'active' : ''}`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
          
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="pagination-button"
          >
            Next →
          </button>
        </div>
      )}

      <style>{`
        .table-container {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          overflow: hidden;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .table-controls {
          padding: 20px;
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
        }

        .controls-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          margin-bottom: 15px;
        }

        .controls-row:last-child {
          margin-bottom: 0;
        }

        .search-container {
          position: relative;
          flex: 1;
          max-width: 400px;
        }

        .search-input {
          width: 100%;
          padding: 12px 40px 12px 16px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 14px;
          transition: all 0.3s ease;
        }

        .search-input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .search-icon {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
        }

        .filters {
          display: flex;
          gap: 20px;
          align-items: center;
        }

        .filter-checkbox {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: #374151;
          cursor: pointer;
        }

        .filter-checkbox input[type="checkbox"] {
          width: 16px;
          height: 16px;
          accent-color: #667eea;
        }

        .status-filter {
          padding: 8px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          background: white;
          cursor: pointer;
        }

        .results-info {
          font-size: 14px;
          color: #6b7280;
        }

        .export-button {
          background: #667eea;
          color: white;
          border: none;
          padding: 10px 16px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .export-button:hover {
          background: #5a67d8;
          transform: translateY(-1px);
        }

        .table-wrapper {
          overflow-x: auto;
          max-height: 600px;
          overflow-y: auto;
        }

        .results-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
        }

        .results-table th {
          background: #f8fafc;
          padding: 16px 12px;
          text-align: left;
          font-weight: 600;
          color: #374151;
          border-bottom: 2px solid #e5e7eb;
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .results-table th.sortable {
          cursor: pointer;
          user-select: none;
          transition: background-color 0.2s ease;
        }

        .results-table th.sortable:hover {
          background: #f1f5f9;
        }

        .results-table td {
          padding: 12px;
          border-bottom: 1px solid #f3f4f6;
          vertical-align: middle;
        }

        .results-table tr.normal-row {
          background: white;
        }

        .results-table tr.anomaly-row {
          background: #fef2f2;
          border-left: 4px solid #ef4444;
        }

        .results-table tr:hover {
          background: #f8fafc;
        }

        .results-table tr.anomaly-row:hover {
          background: #fde8e8;
        }

        .timestamp-cell {
          font-family: 'Monaco', 'Menlo', monospace;
          font-size: 12px;
          color: #4b5563;
          min-width: 180px;
        }

        .ip-cell code {
          background: #f3f4f6;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 13px;
          color: #1f2937;
        }

        .status-badge {
          color: white;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
          text-align: center;
          min-width: 45px;
          display: inline-block;
        }

        .size-cell {
          font-family: 'Monaco', 'Menlo', monospace;
          font-size: 13px;
          color: #6b7280;
          text-align: right;
        }

        .anomaly-indicator {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }

        .anomaly-indicator.is-anomaly {
          background: #fee2e2;
          color: #dc2626;
        }

        .anomaly-indicator.is-normal {
          background: #dcfce7;
          color: #16a34a;
        }

        .no-results {
          text-align: center;
          padding: 60px 20px;
          color: #6b7280;
        }

        .no-results-icon {
          font-size: 4rem;
          margin-bottom: 20px;
          opacity: 0.5;
        }

        .no-results h3 {
          margin: 0 0 10px;
          color: #374151;
          font-weight: 600;
        }

        .no-results p {
          margin: 0;
          font-size: 14px;
        }

        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 8px;
          padding: 20px;
          background: #f8fafc;
          border-top: 1px solid #e5e7eb;
        }

        .pagination-button {
          background: white;
          border: 1px solid #d1d5db;
          color: #374151;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .pagination-button:hover:not(:disabled) {
          background: #f3f4f6;
          border-color: #9ca3af;
        }

        .pagination-button:disabled {
          background: #f9fafb;
          color: #9ca3af;
          cursor: not-allowed;
        }

        .page-numbers {
          display: flex;
          gap: 4px;
        }

        .page-number {
          background: white;
          border: 1px solid #d1d5db;
          color: #374151;
          padding: 8px 12px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          min-width: 40px;
          text-align: center;
          transition: all 0.2s ease;
        }

        .page-number:hover {
          background: #f3f4f6;
          border-color: #9ca3af;
        }

        .page-number.active {
          background: #667eea;
          border-color: #667eea;
          color: white;
        }

        .page-number.active:hover {
          background: #5a67d8;
          border-color: #5a67d8;
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .controls-row {
            flex-direction: column;
            align-items: stretch;
            gap: 15px;
          }

          .filters {
            justify-content: space-between;
          }

          .search-container {
            max-width: none;
          }
        }

        @media (max-width: 768px) {
          .table-controls {
            padding: 15px;
          }

          .filters {
            flex-direction: column;
            gap: 15px;
            align-items: stretch;
          }

          .results-table {
            font-size: 12px;
          }

          .results-table th,
          .results-table td {
            padding: 8px;
          }

          .timestamp-cell {
            min-width: 140px;
            font-size: 11px;
          }

          .pagination {
            padding: 15px;
            flex-wrap: wrap;
          }

          .pagination-button {
            padding: 6px 12px;
            font-size: 13px;
          }

          .page-number {
            padding: 6px 10px;
            font-size: 13px;
            min-width: 35px;
          }
        }

        @media (max-width: 480px) {
          .results-table th:nth-child(1),
          .results-table td:nth-child(1) {
            display: none;
          }

          .ip-cell code {
            font-size: 11px;
            padding: 2px 6px;
          }

          .status-badge {
            font-size: 11px;
            padding: 3px 8px;
          }

          .anomaly-indicator {
            font-size: 11px;
            padding: 4px 8px;
          }
        }

        /* Custom scrollbar for table */
        .table-wrapper::-webkit-scrollbar {
          height: 6px;
          width: 6px;
        }

        .table-wrapper::-webkit-scrollbar-track {
          background: #f1f5f9;
        }

        .table-wrapper::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }

        .table-wrapper::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }

        /* Loading animation for better UX */
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .results-table tbody tr {
          animation: fadeIn 0.3s ease-out;
        }

        /* Highlight search matches */
        .highlight {
          background-color: #fef08a;
          padding: 1px 2px;
          border-radius: 2px;
        }
      `}</style>
    </div>
  );
};

export default ResultsTable;