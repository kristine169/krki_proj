(async () => {
  const front = window.getSelection().toString();
  if (!front) {
    alert("No text selected.");
    return;
  }

  const back = prompt("Enter the back side of the flashcard:", "");
  if (back === null) {
    return; // User cancelled
  }

  const hint = prompt("Enter a hint (optional):", "") || "";
  const tagsInput = prompt("Enter tags separated by commas (optional):", "") || "";
  const tags = tagsInput.split(",").map(tag => tag.trim()).filter(tag => tag.length > 0);

  return { front, back, hint, tags };
})();
