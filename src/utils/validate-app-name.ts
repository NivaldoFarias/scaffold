import { validatePkgName } from "./validate-npm-package-name.js";

export function validateAppName(value: string) {
	const { validForNewPackages, errors, warnings } = validatePkgName(value);

	if (!validForNewPackages) {
		if (errors.length + warnings.length === 1) {
			return errors.concat(warnings).join("\n");
		} else {
			return (
				"\n" +
				errors
					.concat(warnings)
					.map((txt, index) => `${index + 1}. ${txt}`)
					.join("\n")
			);
		}
	}
}
