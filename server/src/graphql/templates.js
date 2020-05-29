export const newCard = {
  templateId: "from db",
  templateTitle: "Basic",
  entries: [
    {
      id: 0,
      name: "Front",
      content: {
        tree: [{
          type: "paragraph",
          data: { text: "" }
        }]
      },
      type: "Q",
    },
    {
      id: 1,
      name: "Back",
      content: {
        tree: [{
          type: "paragraph",
          data: { text: "" }
        }]
      },
      type: "A",
    }
  ]
}

export const newTopic = {
  templateId: "from db",
  templateTitle: "Basic Topic",
  entries: [
    {
      id: 0,
      name: "Custom field",
      type: "C",
      content: {
        tree: [{
          type: "paragraph",
          data: { text: "" }
        }]
      }
    }
  ]
}

export const newDeckTreeItem = {
  hasChildren: false,
  children: [],
  isExpanded: false,
  data: { }
}