export const useString = () => {
  const stringNoHtml = (str: string) => {
    if (!str) return str;
    return str.replace(/(<([^>]+)>)/gi, "").trim();
  };

  const noNbsp = (str: string) => {
    if (!str) return str;
    return str
      .replace(/\u00a0/g, " ")
      .replace(/&nbsp;/g, " ")
      .trim();
  };

  const htmlNoClasses = async (str: string) => {
    if (!str) return str;
    try {
      console.log(
        JSON.stringify({
          dom: encodeURIComponent(str),
          type: "remove-classes",
        })
      );

      const response = await fetch("/api/tools/string", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dom: encodeURIComponent(str),
          type: "remove-classes",
        }),
      }).then((res) => res.json());

      if (!response.data) {
        throw new Error("No data found");
      }

      return {
        data: response.data,
        errors: null,
      };
    } catch (err: any) {
      return {
        errors: err.message,
        data: null,
      };
    }
  };

  return {
    stringNoHtml,
    noNbsp,
    htmlNoClasses,
  };
};
