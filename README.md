# Favlobi Backend

Favlobi main backend for all frontends, API's, webhooks etc.

## Notes

### Mail

Edge + MJML Integration:

Edge (.edge): Handles dynamic content and translations

- Allows using {{ }} syntax for variables
- Enables i18n translation functions t()
- Processes server-side logic

MJML: Ensures email client compatibility

- Converts MJML tags to responsive HTML email code
- Handles email-specific styling consistently across clients
- Provides email-optimized components

Together they create dynamic, translated AND email-compatible templates

### Database

node ace make:migration model-name
node ace migration:run
node ace migration:fresh --seed
