function ShowPercentagesFirst(element, compWith) {
  let comparison = []
  let r = String(element.data)
  return new Promise((resolve, reject) => {
    debugger
    compWith.forEach((value) => { readAndPush(value.code, r, comparison) })
    resolve(comparison)
  })
}
function readAndPush(value, r, comparison) {
  const [first, second] = Normalize(String(value), r)
  comparison.push(levenshtein(first, second, null, first.length, second.length))
}
function NormalizeSlave(string) {
  return string.toLowerCase().replace(/\s/g, '').replace(/(\r\n|\n|\r)/gm, "")
}
function Normalize(string1, string2) {
  return [NormalizeSlave(string1), NormalizeSlave(string2)]
}
function levenshtein(s1, s2, costs, firstLength, secondLength) {
  var i, j, l1, l2, flip, ch, chl, ii, ii2, cost, cutHalf;
  l1 = s1.length;
  l2 = s2.length;

  costs = costs || {};
  var cr = costs.replace || 1;
  var cri = costs.replaceCase || costs.replace || 1;
  var ci = costs.insert || 1;
  var cd = costs.remove || 1;

  cutHalf = flip = Math.max(l1, l2);

  var minCost = Math.min(cd, ci, cr);
  var minD = Math.max(minCost, (l1 - l2) * cd);
  var minI = Math.max(minCost, (l2 - l1) * ci);
  var buf = new Array((cutHalf * 2) - 1);

  for (i = 0; i <= l2; ++i)   buf[i] = i * minD;

  for (i = 0; i < l1; ++i, flip = cutHalf - flip) {
    ch = s1[i];
    chl = ch.toLowerCase();
    buf[flip] = (i + 1) * minI;
    ii = flip;
    ii2 = cutHalf - flip;
    for (j = 0; j < l2; ++j, ++ii, ++ii2) {
      cost = (ch === s2[j] ? 0 : (chl === s2[j].toLowerCase()) ? cri : cr);
      buf[ii + 1] = Math.min(buf[ii2 + 1] + cd, buf[ii] + ci, buf[ii2] + cost);
    }
  }
  return (1 - (buf[l2 + cutHalf - flip] / Math.max(firstLength, secondLength))) * 100
}
module.exports = { ShowPercentagesFirst: ShowPercentagesFirst }