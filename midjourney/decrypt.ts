function jsonDecrpter(data: string): any {
  const json_data = data;
  const parse_data = JSON.parse(json_data);

  return parse_data;
}

export { jsonDecrpter };
