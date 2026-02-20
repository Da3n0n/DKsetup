export interface Installer {
    name: string;
    description: string;
    /**
     * Checks if the software is already installed.
     * Returns true if installed, false otherwise.
     */
    check: () => Promise<boolean>;
    /**
     * Runs the installation process for the software.
     */
    install: () => Promise<void>;
}
