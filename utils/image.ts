export const fetchImage = async (url: string) => {
  const image = await fetch(
    `${
      process.env.NEXT_PUBLIC_PROXY_SERVER_URL || "http://localhost:8080"
    }/${url}`,
    {
      method: "GET",
    }
  );
  const fileName = url.split("/")?.pop()?.split("?").shift();
  const imageBlob = await image.blob();
  return {
    fileName,
    url: URL.createObjectURL(imageBlob),
  };
};

export const downloadFromUrl = async (url: string | [string]) => {
  if (typeof url !== "string") {
    const images = await Promise.all(url.map((u) => fetchImage(u)));
    images.forEach((i) => {
      const link = document.createElement("a");
      link.href = i.url;
      link.download = i.fileName || "image.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  } else {
    const image = await fetchImage(url);
    const link = document.createElement("a");
    link.href = image.url;
    link.download = image.fileName || "image.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
