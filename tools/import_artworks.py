from pathlib import Path
import argparse
import json
import shutil
import subprocess
import tempfile


PROJECT = Path(__file__).resolve().parent.parent
ORIGINALS = PROJECT / "originals"
PROCESSED = PROJECT / "processed"
CATALOGUE = PROJECT / "data" / "artworks.json"

ARCHIVE_ROOT = PROJECT.parent / "GalaGlez-Originals"

TITLES = [
    ("Companheiro", "Retrato"),
    ("Bosque Azul", "Paisagem"),
    ("Reflexos da Floresta", "Natureza"),
    ("Cavalo ao Vento", "Natureza"),
    ("Flores de Luz", "Natureza"),
    ("Arlequim", "Retrato"),
    ("Equilíbrio", "Pintura"),
    ("Forma Orgânica", "Natureza"),
    ("A Coruja", "Natureza"),
    ("A Abelha", "Natureza"),
    ("Peixes em Movimento", "Natureza"),
    ("Vasos em Silêncio", "Pintura"),
    ("Caminho entre Árvores", "Paisagem"),
    ("Vasos e Taça", "Pintura"),
    ("Folhas de Outono", "Natureza"),
    ("Ave do Paraíso", "Natureza"),
    ("Esfera e Cubos", "Pintura"),
    ("Maçã Vermelha", "Natureza"),
    ("Olhar Felino", "Retrato"),
    ("Esfera em Equilíbrio", "Pintura"),
    ("Leopardo em Movimento", "Natureza"),
    ("Esfera de Flores", "Natureza"),
    ("Retrato de um Cão", "Retrato"),
    ("Urso Polar", "Natureza"),
    ("Rã entre Vegetação", "Natureza"),
    ("Folhagem", "Natureza"),
    ("Duas Cerejas", "Natureza"),
    ("Flores Tropicais", "Natureza"),
    ("O Navio", "Paisagem"),
    ("O Pincel", "Pintura"),
    ("Rosto Egípcio", "Retrato"),
    ("A Grande Coruja", "Natureza"),
    ("Retrato Masculino", "Retrato"),
    ("Camaleão", "Natureza"),
    ("Silêncio na Floresta", "Paisagem"),
    ("Mar ao Entardecer", "Paisagem"),
    ("Vaso e Esfera", "Pintura"),
    ("Gato", "Natureza"),
    ("Aldeia junto à Água", "Paisagem"),
    ("Ave do Paraíso II", "Natureza"),
    ("Memória de uma Paisagem", "Paisagem"),
    ("Retrato Egípcio II", "Retrato"),
    ("Mar Aberto", "Paisagem"),
    ("Retrato Feminino", "Retrato"),
    ("Cadeado", "Pintura"),
    ("Horizonte de Ténis", "Paisagem"),
    ("Jardim Tropical", "Natureza"),
]

SUPPORTED = {".jpeg", ".jpg", ".heic"}


def get_sources():
    return sorted(
        [
            path
            for path in ORIGINALS.iterdir()
            if path.is_file() and path.suffix.lower() in SUPPORTED
        ],
        key=lambda path: path.name.lower(),
    )


def read_catalogue():
    if not CATALOGUE.exists():
        return []

    with CATALOGUE.open("r", encoding="utf-8") as file:
        return json.load(file)


def next_artwork_number(catalogue):
    numbers = []

    for artwork in catalogue:
        artwork_id = artwork.get("id", "")
        if artwork_id.startswith("obra-"):
            try:
                numbers.append(int(artwork_id.split("-")[1]))
            except ValueError:
                pass

    existing_files = list(PROCESSED.glob("obra-*.webp"))

    for path in existing_files:
        try:
            numbers.append(int(path.stem.split("-")[1]))
        except ValueError:
            pass

    return max(numbers, default=0) + 1


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--run",
        action="store_true",
        help="Executa efectivamente a importação."
    )
    args = parser.parse_args()

    if not ORIGINALS.exists():
        raise SystemExit("ERRO: a pasta originals/ não existe.")

    sources = get_sources()

    if len(sources) != len(TITLES):
        raise SystemExit(
            f"ERRO: encontrei {len(sources)} fotografias, "
            f"mas o plano actual contém {len(TITLES)}."
        )

    catalogue = read_catalogue()
    start_number = next_artwork_number(catalogue)

    if start_number != 6:
        print(
            f"AVISO: o próximo número detectado é obra-{start_number:02d}, "
            "não obra-06."
        )

    if start_number + len(sources) - 1 > 99:
        raise SystemExit("ERRO: ultrapassado o limite de numeração previsto.")

    batch_name = "2026-09-batch-01"
    archive = ARCHIVE_ROOT / batch_name

    print()
    print("=== SIMULAÇÃO DE IMPORTAÇÃO ===")
    print()
    print(f"Fotografias encontradas : {len(sources)}")
    print(f"Primeiro ID             : obra-{start_number:02d}")
    print(f"Último ID               : obra-{start_number + len(sources) - 1:02d}")
    print(f"Arquivo dos originais   : {archive}")
    print()
    print("FOTOGRAFIA → OBRA → TÍTULO")
    print("-" * 100)

    records = []

    for index, source in enumerate(sources):
        artwork_number = start_number + index
        artwork_id = f"obra-{artwork_number:02d}"
        title, category = TITLES[index]

        print(
            f"{source.name}  →  {artwork_id}  →  {title}  [{category}]"
        )

        records.append(
            {
                "id": artwork_id,
                "title": title,
                "category": category,
                "image": f"processed/{artwork_id}.webp",
            }
        )

    if not args.run:
        print()
        print("SIMULAÇÃO CONCLUÍDA.")
        print("Nenhum ficheiro foi alterado.")
        print("Para executar realmente, usar: python3 tools/import_artworks.py --run")
        return

    print()
    print("=== A EXECUTAR IMPORTAÇÃO ===")
    print()

    archive.mkdir(parents=True, exist_ok=True)
    PROCESSED.mkdir(parents=True, exist_ok=True)
    CATALOGUE.parent.mkdir(parents=True, exist_ok=True)

    staging = Path(
        tempfile.mkdtemp(prefix=".import-", dir=str(PROCESSED))
    )

    staged_outputs = []

    try:
        for index, source in enumerate(sources):
            artwork_number = start_number + index
            artwork_id = f"obra-{artwork_number:02d}"
            output = staging / f"{artwork_id}.webp"

            archived_source = archive / source.name

            if not archived_source.exists():
                shutil.copy2(source, archived_source)

            command = [
                "magick",
                str(source),
                "-auto-orient",
                "-strip",
                "-resize",
                "2000x2000>",
                "-quality",
                "85",
                "-define",
                "webp:method=6",
                str(output),
            ]

            result = subprocess.run(
                command,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
            )

            if result.returncode != 0:
                raise RuntimeError(
                    f"Falha no processamento de {source.name}:\n"
                    f"{result.stderr}"
                )

            if not output.exists() or output.stat().st_size == 0:
                raise RuntimeError(
                    f"A imagem processada não foi criada correctamente: {output}"
                )

            staged_outputs.append((output, PROCESSED / output.name))

        for staged, final in staged_outputs:
            if final.exists():
                raise RuntimeError(
                    f"O ficheiro de destino já existe: {final}"
                )

        new_catalogue = catalogue + records

        with tempfile.NamedTemporaryFile(
            "w",
            encoding="utf-8",
            dir=str(CATALOGUE.parent),
            delete=False,
        ) as temporary:
            json.dump(new_catalogue, temporary, ensure_ascii=False, indent=2)
            temporary.write("\n")
            catalogue_temp = Path(temporary.name)

        for staged, final in staged_outputs:
            shutil.move(str(staged), str(final))

        shutil.move(str(catalogue_temp), str(CATALOGUE))

        for source in sources:
            source.unlink()

        shutil.rmtree(staging, ignore_errors=True)

        print("Importação concluída com sucesso.")
        print(f"Originais arquivados em: {archive}")
        print(f"Imagens processadas em: {PROCESSED}")
        print(f"Catálogo actualizado: {CATALOGUE}")

    except Exception:
        shutil.rmtree(staging, ignore_errors=True)
        raise


if __name__ == "__main__":
    main()
