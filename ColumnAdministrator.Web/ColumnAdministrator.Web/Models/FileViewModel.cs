using System.IO;

namespace ColumnAdministrator.Web.Models {

    /// <summary>
    /// Модель для картинок к товару
    /// </summary>
    public class FileViewModel {

        public FileViewModel() { }

        public FileViewModel(FileInfo fileinfo, bool isdefault) {
            Name = fileinfo.Name;
            Size = (double)fileinfo.Length / 1024;
            FullName = fileinfo.FullName;
            IsDefault = isdefault;
        }

        public string FullName { get; set; }

        public double Size { get; set; }

        public string Name { get; set; }

        public bool IsDefault { get; set; }
    }

    /// <summary>
    /// Модель для галереи
    /// </summary>
    public class GalleryFileViewModel : FileViewModel
    {

        public GalleryFileViewModel(FileInfo fileInfo, string folderName, string imageUrl)
            : base(fileInfo, false)
        {
            FolderName = folderName;
            ProductUrl = imageUrl;

        }

        /// <summary>
        /// Доступность фото в списке решается на основании доступности каталога, подкаталога и товара.
        /// </summary>
        public bool IsVisible { get; set; }

        /// <summary>
        /// название папки в которой лежить FileViewModel
        /// </summary>
        public string FolderName { get; private set; }

        /// <summary>
        /// Относительный Url к фото
        /// (разбирается на основании имени фото)
        /// </summary>
        public string ProductUrl { get; private set; }
    }
}