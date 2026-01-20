// FormData を複製し、fetch に渡せる形式に変換
export function cloneFormData(entries: Array<[string, FormDataEntryValue]>) {
  const formData = new FormData();
  for (const [key, value] of entries) {
    if (typeof value === "string") {
      formData.append(key, value);
    } else {
      formData.append(key, value, value.name);
    }
  }
  return formData;
}
