
// For the actions section:
const actions = [
  {
    label: "View Details",
    onClick: (issue) => viewIssueDetails(issue),
  },
  {
    label: "Mark Returned",
    onClick: (issue) => markAsReturned(issue),
    variant: (issue) => issue.status === "Issued" ? "default" : "secondary" as ButtonVariant,
    disabled: (issue) => issue.status !== "Issued",
  },
  {
    label: "Print Receipt",
    onClick: (issue) => printReceipt(issue),
  },
];
