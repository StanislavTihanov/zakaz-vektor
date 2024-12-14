import gulp from 'gulp';
import { deleteAsync } from 'del';

// Пути к папкам
const paths = {
    sourceFolders: [
        'fonts/**/*',        // Все файлы из папки fonts
        'images/**/*',       // Все файлы из папки images
        'styles/styles.css', // Только файл styles.css из папки styles
        'js/**/*',           // Все файлы из папки js
        '*.html'             // Все HTML-файлы в корневой директории
    ],
    outputFolder: 'dist' // Папка назначения
};

// Очистка папки назначения
function clean() {
    return deleteAsync([paths.outputFolder]);
}

// Копирование файлов из исходных папок в папку назначения
function copy() {
    return gulp
        .src(paths.sourceFolders, { base: '.' }) // Берем файлы из указанных путей
        .pipe(gulp.dest(paths.outputFolder)); // Сохраняем в папку назначения
}

// Задача по умолчанию (очистка и копирование)
export default gulp.series(clean, copy);
