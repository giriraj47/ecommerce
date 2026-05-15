// utils/updateParams.js

export const updateParams = (setParams, page = 1, search = "") => {
  const newParams = {};

  if (page > 1) {
    newParams.page = page;
  }

  if (search.trim()) {
    newParams.search = search;
  }

  setParams(newParams);
};
