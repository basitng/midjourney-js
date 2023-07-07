function jsonDecrpter(data) {
  const json_data = data;
  const parse_data = JSON.parse(json_data);

  return parse_data;
}

module.exports = jsonDecrpter;
