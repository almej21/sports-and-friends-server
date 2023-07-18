exports.haveCommonElement = (arr1, arr2) => {
  // Check if any element in arr1 exists in arr2
  return arr1.some((item) => arr2.includes(item));
};
