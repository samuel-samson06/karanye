// Karanyé standard size chart — real content supplied by the brand, so no
// TODO(content) markers on the values. Displayed on Size & Fit and used as
// reference for the standard-size purchase path.
// Note: size 4 carried an extra "armhole_length" value in the source data;
// normalized away to the nine fields shown on the chart card.

export interface SizeMeasurementKey {
  key:
    | "shoulder_width"
    | "neck_width"
    | "bust"
    | "waist"
    | "hips"
    | "shoulder_bust_point"
    | "shoulder_underbust"
    | "shoulder_waist_half_length"
    | "armhole";
  label: string;
}

export const sizeMeasurementKeys: SizeMeasurementKey[] = [
  { key: "shoulder_width", label: "Shoulder width" },
  { key: "neck_width", label: "Neck width" },
  { key: "bust", label: "Bust" },
  { key: "waist", label: "Waist" },
  { key: "hips", label: "Hips" },
  { key: "shoulder_bust_point", label: "Shoulder - bust point" },
  { key: "shoulder_underbust", label: "Shoulder - underbust" },
  { key: "shoulder_waist_half_length", label: "Shoulder - waist (half length)" },
  { key: "armhole", label: "Armhole" },
];

export const sizeChartUnit = "inches";

export const sizeChartTagline = "To become through full self expression";

export const sizeChartNoteHeading = "Please note";

export const sizeChartNotes: string[] = [
  'All measurements are in inches (").',
  "All sizes are UK sizes.",
  "These are body measurements and can be used to determine your closest Karanyé size.",
  "If your measurements fall between two sizes, we recommend choosing the larger size or opting for our made-to-measure service.",
];

export type SizeChartRow = Record<SizeMeasurementKey["key"], string>;

export const sizeChart: Record<number, SizeChartRow> = {
  4: {
    shoulder_width: '13"',
    neck_width: '2.5"',
    bust: '32"',
    waist: '25"',
    hips: '36"',
    shoulder_bust_point: '8.5"',
    shoulder_underbust: '12.5"',
    shoulder_waist_half_length: '15"',
    armhole: '14"',
  },
  6: {
    shoulder_width: '14"',
    neck_width: '2.75"',
    bust: '34"',
    waist: '27"',
    hips: '38"',
    shoulder_bust_point: '9"',
    shoulder_underbust: '12.5"',
    shoulder_waist_half_length: '15"',
    armhole: '15"',
  },
  8: {
    shoulder_width: '14.5"',
    neck_width: '3"',
    bust: '36"',
    waist: '28"',
    hips: '40"',
    shoulder_bust_point: '9.5"',
    shoulder_underbust: '13"',
    shoulder_waist_half_length: '15"',
    armhole: '16"',
  },
  10: {
    shoulder_width: '16"',
    neck_width: '3"',
    bust: '38"',
    waist: '30"',
    hips: '42"',
    shoulder_bust_point: '10"',
    shoulder_underbust: '13.5"',
    shoulder_waist_half_length: '16"',
    armhole: '17"',
  },
  12: {
    shoulder_width: '17"',
    neck_width: '3.25"',
    bust: '40"',
    waist: '32"',
    hips: '44"',
    shoulder_bust_point: '10.5"',
    shoulder_underbust: '14.5"',
    shoulder_waist_half_length: '16.5"',
    armhole: '18"',
  },
  14: {
    shoulder_width: '17"',
    neck_width: '3.25"',
    bust: '42"',
    waist: '34"',
    hips: '46"',
    shoulder_bust_point: '11"',
    shoulder_underbust: '15"',
    shoulder_waist_half_length: '17"',
    armhole: '18"',
  },
  16: {
    shoulder_width: '18"',
    neck_width: '3.5"',
    bust: '44"',
    waist: '36"',
    hips: '48"',
    shoulder_bust_point: '11.5"',
    shoulder_underbust: '16"',
    shoulder_waist_half_length: '18"',
    armhole: '19"',
  },
  18: {
    shoulder_width: '18"',
    neck_width: '3.5"',
    bust: '46"',
    waist: '38"',
    hips: '50"',
    shoulder_bust_point: '12"',
    shoulder_underbust: '16.5"',
    shoulder_waist_half_length: '19"',
    armhole: '20"',
  },
  20: {
    shoulder_width: '18"',
    neck_width: '3.75"',
    bust: '48"',
    waist: '40"',
    hips: '54"',
    shoulder_bust_point: '12.5"',
    shoulder_underbust: '17"',
    shoulder_waist_half_length: '20"',
    armhole: '22"',
  },
  22: {
    shoulder_width: '21" (up to)',
    neck_width: '3.75"',
    bust: '50"',
    waist: '42"',
    hips: '58"',
    shoulder_bust_point: '13"',
    shoulder_underbust: '18"',
    shoulder_waist_half_length: '22"',
    armhole: '24"',
  },
};

export const sizeChartOrder = Object.keys(sizeChart).map(Number);
