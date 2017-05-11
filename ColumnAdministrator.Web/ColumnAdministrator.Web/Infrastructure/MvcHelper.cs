using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Security;
using ColumnAdministrator.Web.Models;

namespace ColumnAdministrator.Web.Infrastructure {
    public static class MvcHelper {

        /// <summary>
        /// Перемещение (переименование) папки
        /// </summary>
        /// <param name="currentName">текущее название папки вместе с относительным путем</param>
        /// <param name="newName">новое название папки вместе с относительным путем</param>
        /// <returns>удача/неудача</returns>
        public static bool RenameFolder(string currentName, string newName) {
            if (string.IsNullOrEmpty(currentName)) throw new ArgumentNullException("currentName", "Переименование невозможно из-за отсутствия параметра");
            if (string.IsNullOrEmpty(newName)) throw new ArgumentNullException("newName", "Переименование невозможно из-за отсутствия параметра");

            if (currentName.ToLower(CultureInfo.CurrentCulture).Equals(newName.ToLower(CultureInfo.CurrentCulture))) return true;
            var dir = HttpContext.Current.Server.MapPath(currentName);
            var newdir = HttpContext.Current.Server.MapPath(newName);
            if (Directory.Exists(dir)) {
                Directory.Move(dir, newdir);
                return true;
            }
            return false;
        }

        /// <summary>
        /// Удаление файла
        /// </summary>
        /// <param name="fileName">имя файла</param>
        /// <param name="filePath">путь до файла без тильды и слеша вначале</param>
        /// <returns>удача/неудача</returns>
        public static bool DeleteFile(string fileName, string filePath) {
            if (string.IsNullOrEmpty(fileName)) throw new ArgumentNullException("fileName", "Удаление невозможно из-за отсутствия параметра");
            if (string.IsNullOrEmpty(filePath)) throw new ArgumentNullException("filePath", "Удаление невозможно из-за отсутствия параметра");
            string dir = HttpContext.Current.Server.MapPath(string.Concat("~/", filePath));
            if (Directory.Exists(dir)) {
                if (File.Exists(dir + "/" + fileName)) {
                    File.Delete(dir + "/" + fileName);
                    if (!Directory.GetFiles(dir).Any()) {
                        Directory.Delete(dir);
                    }
                    return true;
                }
            }
            return false;
        }

        /// <summary>
        /// Удаление файла
        /// </summary>
        /// <returns>удача/неудача</returns>
        public static bool DeleteFile(string fileNameWithPath) {
            if (fileNameWithPath == null) throw new ArgumentNullException("fileNameWithPath");
            if (string.IsNullOrEmpty(fileNameWithPath)) throw new ArgumentNullException("fileNameWithPath", "Удаление невозможно из-за отсутствия параметра");
            string dir = HttpContext.Current.Server.MapPath(string.Concat("~/", fileNameWithPath));
            if (File.Exists(dir)) {
                File.Delete(fileNameWithPath);
                return true;
            }
            return false;
        }

        /// <summary>
        /// Удаление папки и вложенных файлов
        /// </summary>
        /// <param name="folderName">название папки</param>
        /// <returns>удача/неудача</returns>
        public static bool DeleteFolder(string folderName) {
            if (string.IsNullOrEmpty(folderName)) throw new ArgumentNullException("folderName", "Удаление невозможно из-за отсутствия параметра");
            string dir = HttpContext.Current.Server.MapPath(string.Concat("~/uploads/", folderName));
            if (Directory.Exists(dir)) {
                foreach (string item in Directory.GetFiles(dir)) {
                    File.Delete(item);
                }
                Directory.Delete(dir);
                return true;
            }
            return false;
        }

        /// <summary>
        /// Читать Cookie
        /// </summary>
        /// <param name="userName"></param>
        /// <param name="userEmail"></param>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1021:AvoidOutParameters", MessageId = "0#", Justification = "Calabonga")]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1021:AvoidOutParameters", MessageId = "1#", Justification = "Calabonga")]
        public static void GetCookie(out string userName, out string userEmail) {
            userName = string.Empty;
            userEmail = string.Empty;
            if ((HttpContext.Current.Request.Cookies["sitecookies"] != null)
                && (HttpContext.Current.Request.Cookies["sitecookies"]["Name"] != null)
                && (HttpContext.Current.Request.Cookies["sitecookies"]["Email"] != null)) {
                userName = HttpContext.Current.Request.Cookies["sitecookies"]["Name"].ToString(CultureInfo.InvariantCulture);
                userEmail = HttpContext.Current.Request.Cookies["sitecookies"]["Email"].ToString(CultureInfo.InvariantCulture);
            }
        }

        /// <summary>
        /// Записать Cookie
        /// </summary>
        /// <param name="userName"></param>
        /// <param name="userEmail"></param>
        public static void SetCookie(string userName, string userEmail) {
            var cookie = new HttpCookie("sitecookies");
            cookie["Name"] = userName;
            cookie["Email"] = userEmail;
            cookie.Expires = DateTime.Now.AddDays(30);
            HttpContext.Current.Response.Cookies.Add(cookie);
        }

        /// <summary>
        /// Вызвращает количество файлов в папке
        /// </summary>
        /// <param name="productId"></param>
        /// <returns></returns>
        public static int GetFilesCount(int productId) {
            if (productId == 0) throw new ArgumentNullException("productId");
            string filepath = HttpContext.Current.Server.MapPath(string.Concat("~/Uploads/", productId.ToString(CultureInfo.InvariantCulture)));
            if (Directory.Exists(filepath)) {
                var dir = new DirectoryInfo(filepath);
                return dir.GetFiles().Count();
            }
            return 0;
        }

        /// <summary>
        /// Возращает массив всех файлов в папке Uploads
        /// без проверки на "по умолчанию"
        /// </summary>
        /// <param name="productId">индентификатор товара</param>
        /// <returns>массив FileViewModel</returns>
        public static FileViewModel[] ProductImages(int productId) {
            return ProductImages(productId, "no photo checking", null);
        }

        /// <summary>
        /// Возращает массив всех файлов в папке Uploads
        /// без проверки на "по умолчанию" только во вложенной папке
        /// </summary>
        /// <param name="productId">индентификатор товара</param>
        /// <param name="nestedFolder">вложенная папка</param>
        /// <returns>массив FileViewModel</returns>
        public static FileViewModel[] ProductImages(int productId, string nestedFolder) {
            return ProductImages(productId, "no photo checking", nestedFolder);
        }

        /// <summary>
        /// Возращает массив всех файлов в папке Uploads
        /// с проверкой на "по умолчанию"
        /// </summary>
        /// <param name="productId">идентификатор товара</param>
        /// <param name="defaultThumbnail">название картинки по умолчанию</param>
        /// <returns>массив FileViewModel</returns>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1026:DefaultParametersShouldNotBeUsed", Justification = "нужен")]
        public static FileViewModel[] ProductImages(int productId, string defaultThumbnail, string nestedFolder = "") {
            if (productId == 0) throw new ArgumentNullException("productId");

            string filepath = string.Empty;
            if (string.IsNullOrEmpty(nestedFolder)) {
                filepath = HttpContext.Current.Server.MapPath(string.Concat("~/Uploads/", productId.ToString(CultureInfo.InvariantCulture)));
            }
            else {
                filepath = HttpContext.Current.Server.MapPath(string.Concat("~/Uploads/", nestedFolder, "/", productId.ToString(CultureInfo.InvariantCulture)));
            }

            var result = new List<FileViewModel>();
            if (Directory.Exists(filepath)) {
                var dir = new DirectoryInfo(filepath);
                var files = dir.GetFiles();
                if (files.Any()) {
                    result.AddRange(files.Select(item => new FileViewModel(item, item.Name.Equals(defaultThumbnail))));
                }
            }
            return result.ToArray();
        }

        /// <summary>
        /// Возвращает все файлы в папке Upload
        /// и во вложенных файлах
        /// </summary>
        /// <returns>массив FileViewModel</returns>
        public static FileViewModel[] ProductsImages() {
            var filepath = HttpContext.Current.Server.MapPath("~/Uploads/");
            var result = new List<FileViewModel>();
            var uploads = new DirectoryInfo(filepath);
            var dirs = uploads.GetDirectories();
            if (dirs.Any()) {
                result.AddRange(from dir in dirs from file in dir.GetFiles() select new FileViewModel(file, false));
            }
            return result.ToArray();
        }

        #region Status Codes

        internal static string ErrorCodeToString(MembershipCreateStatus createStatus) {
            // See http://go.microsoft.com/fwlink/?LinkID=177550 for
            // a full list of status codes.
            switch (createStatus) {
                case MembershipCreateStatus.DuplicateUserName:
                    return "Пользователь с таким именем уже существует.";

                case MembershipCreateStatus.DuplicateEmail:
                    return "Такой адресс электроктронной почты уже зарегистрирован на другого пользователя";

                case MembershipCreateStatus.InvalidPassword:
                    return "Неверный формат пароля. Придумайте другой";

                case MembershipCreateStatus.InvalidEmail:
                    return "Форма адрес электронной почты неверный.";

                case MembershipCreateStatus.InvalidAnswer:
                    return "Ответ на секретный вопрос неверный.";

                case MembershipCreateStatus.InvalidQuestion:
                    return "Неверный серкертный вопрос.";

                case MembershipCreateStatus.InvalidUserName:
                    return "Неверное название для имени пользователя.";

                case MembershipCreateStatus.ProviderError:
                    return "Ошибка аутентификации. Попробуйте повторить попытку позже.";

                case MembershipCreateStatus.UserRejected:
                    return "Создание учетной записи прервано по причине непредвиденной ошибки.";

                default:
                    return "Неожиданная ошибка. Обратитель пожалуйста в службу поддержки.";
            }
        }

        #endregion Status Codes

        public static bool IsAdmin() {
            if (HttpContext.Current.User.Identity.IsAuthenticated) {
                if (HttpContext.Current.User.IsInRole("Administrator")) {
                    return true;
                }
            }
            return false;
        }
    }
}