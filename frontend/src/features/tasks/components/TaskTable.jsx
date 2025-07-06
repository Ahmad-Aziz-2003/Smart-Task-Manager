import React, { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import TablePagination from "@mui/material/TablePagination";
import TableSortLabel from "@mui/material/TableSortLabel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { format } from "date-fns";
import ConfirmationModal from "../../../components/ConfirmationModal";

const statusIcons = {
  completed: <CheckCircleIcon color="success" fontSize="small" />, // green
  failed: <CancelIcon color="error" fontSize="small" />, // red
  inprogress: <HourglassEmptyIcon color="warning" fontSize="small" />, // yellow
};

const statusLabels = {
  completed: "Completed",
  failed: "Failed",
  inprogress: "In Progress",
};

function getStatus(task) {
  if (task.completed) return "completed";
  // You can add more logic for failed/inprogress if you have such fields
  return "inprogress";
}

function getPriorityColor(priority) {
  switch (priority) {
    case "high":
      return { color: "#dc2626", bg: "#fee2e2" }; // red
    case "medium":
      return { color: "#ca8a04", bg: "#fef9c3" }; // yellow
    case "low":
      return { color: "#16a34a", bg: "#dcfce7" }; // green
    default:
      return { color: "#64748b", bg: "#f1f5f9" }; // gray
  }
}

const columns = [
  { id: "title", label: "Task", minWidth: 150 },
  { id: "categoryName", label: "Category", minWidth: 100 },
  { id: "createdAt", label: "Created Date", minWidth: 120 },
  { id: "deadline", label: "End Date", minWidth: 120 },
  { id: "priority", label: "Priority", minWidth: 100 },
  { id: "status", label: "Status", minWidth: 100 },
  { id: "actions", label: "Actions", minWidth: 120 },
];

export default function TaskTable({
  tasks,
  onEdit,
  onDelete,
  onComplete,
  onTaskClick,
  categories = [],
}) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orderBy, setOrderBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");

  // Confirmation modal state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmType, setConfirmType] = useState("danger"); // 'danger' for delete, 'success' for complete
  const [confirmTask, setConfirmTask] = useState(null);
  const [confirmAction, setConfirmAction] = useState(() => () => {});

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleSort = (columnId) => {
    if (orderBy === columnId) {
      setOrder(order === "asc" ? "desc" : "asc");
    } else {
      setOrderBy(columnId);
      setOrder("asc");
    }
  };

  // Filter tasks based on search and filters
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      !categoryFilter || task.categoryName === categoryFilter;
    const matchesStatus = !statusFilter || getStatus(task) === statusFilter;
    const matchesPriority = !priorityFilter || task.priority === priorityFilter;

    return matchesSearch && matchesCategory && matchesStatus && matchesPriority;
  });

  // Sorting logic
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    let aValue = a[orderBy];
    let bValue = b[orderBy];
    if (orderBy === "createdAt" || orderBy === "deadline") {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }
    if (aValue < bValue) return order === "asc" ? -1 : 1;
    if (aValue > bValue) return order === "asc" ? 1 : -1;
    return 0;
  });

  const paginatedTasks = sortedTasks.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Get unique categories for filter
  const uniqueCategories = [
    ...new Set(tasks.map((task) => task.categoryName).filter(Boolean)),
  ];

  return (
    <div className="space-y-1">
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 p-2 bg-gray-50 rounded-lg">
        <TextField
          fullWidth
          size="small"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            "& .MuiOutlinedInput-root": {
              height: "32px",
              fontSize: "13px",
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />

        <FormControl fullWidth size="small">
          <InputLabel sx={{ fontSize: "13px" }}>Category</InputLabel>
          <Select
            value={categoryFilter}
            label="Category"
            onChange={(e) => setCategoryFilter(e.target.value)}
            sx={{
              height: "32px",
              fontSize: "13px",
              "& .MuiSelect-select": {
                paddingTop: "4px",
                paddingBottom: "4px",
              },
            }}
          >
            <MenuItem value="">All Categories</MenuItem>
            {uniqueCategories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth size="small">
          <InputLabel sx={{ fontSize: "13px" }}>Status</InputLabel>
          <Select
            value={statusFilter}
            label="Status"
            onChange={(e) => setStatusFilter(e.target.value)}
            sx={{
              height: "32px",
              fontSize: "13px",
              "& .MuiSelect-select": {
                paddingTop: "4px",
                paddingBottom: "4px",
              },
            }}
          >
            <MenuItem value="">All Status</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
            <MenuItem value="inprogress">In Progress</MenuItem>
            <MenuItem value="failed">Failed</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth size="small">
          <InputLabel sx={{ fontSize: "13px" }}>Priority</InputLabel>
          <Select
            value={priorityFilter}
            label="Priority"
            onChange={(e) => setPriorityFilter(e.target.value)}
            sx={{
              height: "32px",
              fontSize: "13px",
              "& .MuiSelect-select": {
                paddingTop: "4px",
                paddingBottom: "4px",
              },
            }}
          >
            <MenuItem value="">All Priorities</MenuItem>
            <MenuItem value="high">High</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="low">Low</MenuItem>
          </Select>
        </FormControl>
      </div>

      <Paper
        sx={{
          width: "100%",
          overflow: "hidden",
          borderRadius: 3,
          boxShadow: 2,
        }}
      >
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader aria-label="task table" size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: "#2563eb" }}>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align="left"
                    style={{
                      minWidth: column.minWidth,
                      background: "#2563eb",
                      color: "white",
                      fontWeight: 700,
                      paddingTop: 8,
                      paddingBottom: 8,
                    }}
                    sortDirection={orderBy === column.id ? order : false}
                  >
                    {column.id !== "actions" ? (
                      <TableSortLabel
                        active={orderBy === column.id}
                        direction={orderBy === column.id ? order : "asc"}
                        onClick={() => handleSort(column.id)}
                        sx={{
                          color: "white",
                          "& .MuiTableSortLabel-icon": {
                            color: "white !important",
                          },
                        }}
                      >
                        {column.label}
                      </TableSortLabel>
                    ) : (
                      column.label
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedTasks.map((task) => {
                const status = getStatus(task);
                const priority = task.priority || "medium";
                const priorityColors = getPriorityColor(priority);
                return (
                  <TableRow
                    hover
                    key={task._id}
                    sx={{
                      cursor: "pointer",
                      transition: "background 0.2s",
                      height: 36,
                    }}
                    onClick={(e) => {
                      if (e.target.closest("button")) return;
                      if (onTaskClick) onTaskClick(task);
                    }}
                  >
                    {/* Task Title */}
                    <TableCell sx={{ py: 0.5 }}>{task.title}</TableCell>
                    {/* Category */}
                    <TableCell sx={{ py: 0.5 }}>
                      {task.categoryName || (
                        <span style={{ color: "#64748b", fontStyle: "italic" }}>
                          Uncategorized
                        </span>
                      )}
                    </TableCell>
                    {/* Created Date */}
                    <TableCell sx={{ py: 0.5 }}>
                      {task.createdAt
                        ? format(new Date(task.createdAt), "yyyy-MM-dd")
                        : ""}
                    </TableCell>
                    {/* End Date */}
                    <TableCell sx={{ py: 0.5 }}>
                      {task.deadline
                        ? format(new Date(task.deadline), "yyyy-MM-dd")
                        : ""}
                    </TableCell>
                    {/* Priority */}
                    <TableCell sx={{ py: 0.5 }}>
                      <span
                        style={{
                          background: priorityColors.bg,
                          color: priorityColors.color,
                          borderRadius: 12,
                          padding: "2px 10px",
                          fontWeight: 600,
                          fontSize: 13,
                        }}
                      >
                        {priority.charAt(0).toUpperCase() + priority.slice(1)}
                      </span>
                    </TableCell>
                    {/* Status */}
                    <TableCell sx={{ py: 0.5 }}>
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        {statusIcons[status]}
                        <span
                          style={{
                            color:
                              status === "completed"
                                ? "#16a34a"
                                : status === "failed"
                                ? "#dc2626"
                                : "#ca8a04",
                            fontWeight: 600,
                            fontSize: 13,
                          }}
                        >
                          {statusLabels[status]}
                        </span>
                      </span>
                    </TableCell>
                    {/* Actions */}
                    <TableCell sx={{ py: 0.5 }}>
                      <Tooltip title="View Details">
                        <IconButton
                          color="primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            onTaskClick && onTaskClick(task);
                          }}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton
                          color="success"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit && onEdit(task);
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Complete">
                        <IconButton
                          color="primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            setConfirmOpen(true);
                            setConfirmType("success");
                            setConfirmTask(task);
                            setConfirmAction(
                              () => () => onComplete && onComplete(task)
                            );
                          }}
                          disabled={task.completed}
                        >
                          <CheckCircleIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          color="error"
                          onClick={(e) => {
                            e.stopPropagation();
                            setConfirmOpen(true);
                            setConfirmType("danger");
                            setConfirmTask(task);
                            setConfirmAction(
                              () => () => onDelete && onDelete(task)
                            );
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
              {paginatedTasks.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    align="center"
                    sx={{ color: "#64748b", py: 6 }}
                  >
                    No tasks found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={sortedTasks.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => {
          confirmAction();
          setConfirmOpen(false);
        }}
        title={confirmType === "danger" ? "Delete Task" : "Complete Task"}
        message={
          confirmType === "danger"
            ? `Are you sure you want to delete the task "${confirmTask?.title}"? This action cannot be undone.`
            : `Mark the task "${confirmTask?.title}" as complete?`
        }
        confirmText={confirmType === "danger" ? "Delete" : "Complete"}
        cancelText="Cancel"
        type={confirmType}
      />
    </div>
  );
}
