from pydantic2ts import generate_typescript_defs


def main():
    print("Generating TypeScript definitions for FleetFlow shared models...")

    generate_typescript_defs(
        "fleetflow_shared.models",
        "../../frontend/src/types/models.ts"
    )

    print(f"TypeScript definitions generated successfully.")


if __name__ == "__main__":
    main()
