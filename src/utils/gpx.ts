export function generateGPX(trekName: string, coordinates: number[][]): string {
  let gpx = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="KangraVerse" xmlns="http://www.topografix.com/GPX/1/1">
  <trk>
    <name>${trekName}</name>
    <trkseg>
`;

  coordinates.forEach((coord) => {
    const lng = coord[0];
    const lat = coord[1];
    const ele = coord[2] !== undefined ? coord[2] : 0;
    gpx += `      <trkpt lat="${lat}" lon="${lng}">\n        <ele>${ele}</ele>\n      </trkpt>\n`;
  });

  gpx += `    </trkseg>
  </trk>
</gpx>`;

  return gpx;
}

export function downloadGPX(trekName: string, coordinates: number[][]) {
  const gpxContent = generateGPX(trekName, coordinates);
  const blob = new Blob([gpxContent], { type: 'application/gpx+xml' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `${trekName.toLowerCase().replace(/\\s+/g, '_')}.gpx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
