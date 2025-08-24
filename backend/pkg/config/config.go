package config

import (
	"os"
	"path/filepath"
)

// Config holds application configuration
type Config struct {
	Port     string
	DataPath string
}

// Load loads configuration from environment variables and defaults
func Load() *Config {
	port := getEnv("PORT", "8080")
	dataPath := getEnv("DATA_PATH", "data/dataset.csv")

	// Ensure data path is absolute
	if !filepath.IsAbs(dataPath) {
		// Get current working directory
		cwd, err := os.Getwd()
		if err != nil {
			cwd = "."
		}
		dataPath = filepath.Join(cwd, dataPath)
	}

	return &Config{
		Port:     port,
		DataPath: dataPath,
	}
}

// getEnv gets environment variable with fallback default
func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
