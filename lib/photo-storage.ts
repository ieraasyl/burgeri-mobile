import { Directory, File, Paths } from "expo-file-system";

export async function copyProofPhotoAsync(sourceUri: string) {
  const extension = getExtension(sourceUri);
  const directory = new Directory(Paths.document, "write-off-proofs");
  directory.create({ idempotent: true, intermediates: true });

  const source = new File(sourceUri);
  const destination = new File(
    directory,
    `${Date.now()}-${Math.round(Math.random() * 1_000_000)}.${extension}`
  );

  await source.copy(destination);

  return destination.uri;
}

function getExtension(uri: string) {
  const clean = uri.split("?")[0] ?? uri;
  const value = clean.split(".").pop()?.toLowerCase();

  if (!value || value.length > 5) {
    return "jpg";
  }

  return value;
}

