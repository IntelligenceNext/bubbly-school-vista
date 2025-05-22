
// For the actions section with the status variant:
const actions = [
  {
    label: "View Details",
    onClick: (card) => openViewDialog(card),
  },
  {
    label: "Edit",
    onClick: (card) => openEditDialog(card),
  },
  {
    label: "Print Card",
    onClick: (card) => handlePrintCard(card),
  },
  {
    label: (card) => card.status === "Active" ? "Suspend" : "Activate",
    onClick: (card) => handleStatusChange(card),
    variant: (card) => card.status === "Active" ? "warning" : "success" as ButtonVariant,
  },
];
