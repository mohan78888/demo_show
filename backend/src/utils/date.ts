export const formatToMMDDYYYY = (dateStr: string): string => {
  try {
    const dateObj = new Date(dateStr);
    if (isNaN(dateObj.getTime())) {
      const parts = dateStr.split(/[-/]/);
      if (parts.length === 3) {
        if (parts[0].length === 4) return `${parts[1].padStart(2, '0')}/${parts[2].padStart(2, '0')}/${parts[0]}`;
        return `${parts[0].padStart(2, '0')}/${parts[1].padStart(2, '0')}/${parts[2]}`;
      }
      return dateStr;
    }
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    const year = dateObj.getFullYear();
    return `${month}/${day}/${year}`;
  } catch (e) {
    return dateStr;
  }
};

export const formatTimeAMPM = (dateTimeStr: string): string => {
  if (!dateTimeStr) return '12:00 PM';
  try {
    const spaceSplit = dateTimeStr.split(' ');
    if (spaceSplit.length >= 2) {
      const timePart = spaceSplit[1];
      const [hStr, mStr] = timePart.split(':');
      let h = parseInt(hStr, 10);
      const m = parseInt(mStr, 10) || 0;
      const isAM = h < 12;
      h = h % 12 || 12;
      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')} ${isAM ? 'AM' : 'PM'}`;
    }
    return dateTimeStr;
  } catch (e) {
    return dateTimeStr;
  }
};

export const extractCode = (str: string): string => {
  if (!str) return 'DEL';
  const match = str.match(/\(([A-Za-z]{3})\)/);
  if (match) return match[1].toUpperCase();
  const trimmed = str.trim();
  if (trimmed.length === 3) return trimmed.toUpperCase();
  return trimmed.substring(0, 3).toUpperCase();
};
