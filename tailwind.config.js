module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {
            fontFamily: {
                nunito: ['var(--font-nunito)', 'Nunito', 'sans-serif'],
                roboto: ['var(--font-roboto)', 'Roboto', 'sans-serif'],
            },
            fontWeight: {
                thin: '100',
                extralight: '200',
                light: '300',
            },
        },
    },
    plugins: [require('@tailwindcss/forms')],
}
