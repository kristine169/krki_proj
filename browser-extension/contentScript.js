(async () => {
  const back = window.getSelection().toString();
  if (!back) {
    alert("No text selected.");
    return;
  }

  const front = prompt("Enter the back side of the flashcard:", "");
  if (front === null) {
    return; // User cancelled
  }

  const hint = prompt("Enter a hint (optional):", "") || "";
  const tagsInput = prompt("Enter tags separated by commas (optional):", "") || "";
  const tags = tagsInput.split(",").map(tag => tag.trim()).filter(tag => tag.length > 0);

  return { front, back, hint, tags };
})();
