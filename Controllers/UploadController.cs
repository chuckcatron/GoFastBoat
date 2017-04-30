using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace GoFastBoat.com.Controllers
{
    [OutputCache(NoStore = true, Duration = 0, VaryByParam = "*")]
    public class UploadController : Controller
    {
        private const string UploadRoot = "~\\Uploads\\";
        private const string DefaultFilter = "*.jpg,*.jpeg,*.png";

        private static bool IsValidFile(string fileName)
        {
            var extension = Path.GetExtension(fileName);
            var allowedExtensions = DefaultFilter.Split(',');

            return allowedExtensions.Any(e => extension != null && e.EndsWith(extension, StringComparison.InvariantCultureIgnoreCase));
        }

        [AcceptVerbs(HttpVerbs.Post)]
        public virtual JsonResult SaveFile(IEnumerable<HttpPostedFileBase> files)
        {
            foreach (string f in Request.Files)
            {
                var file = Request.Files[f];
                if (file == null) return Json("Uploaded " + Request.Files.Count + " files");
                var fileName = Path.GetFileName(file.FileName);
                if (IsValidFile(fileName))
                {
                    var parentDir = Server.MapPath(UploadRoot);
                    if (!Directory.Exists(parentDir))
                    {
                        Directory.CreateDirectory(parentDir);
                    }
                    var fileList = Directory.GetFiles(parentDir);
                    foreach (var ff in fileList)
                    {
                        var fileInfo = new FileInfo(ff);
                        if (fileInfo.Name == fileName)
                        {
                            System.IO.File.Delete(ff);
                        }
                    }
                    if (fileName != null) file.SaveAs(Path.Combine(parentDir, fileName));
                }
                else
                {
                    throw new HttpException(403, "Only *.jpg, *.jpeg, *.png files are allowed");
                }
                return Json("Uploaded " + Request.Files.Count + " files");
            }
            throw new HttpException(403, "Forbidden");
        }
        
        public virtual ActionResult RemoveFile()
        {
            try
            {
                var path = Server.MapPath(UploadRoot);

                var dir = new DirectoryInfo(path);

                foreach (var file in dir.GetFiles())
                {
                    DeleteFile(file.Name, path);
                }
                return new HttpStatusCodeResult(200);
            }
            catch (Exception ex)
            {
                throw new HttpException(403, "Forbidden");
            }
        }

        private void DeleteFile(string fileName, string path)
        {
            var file = new FileInfo(Path.Combine(path, fileName));
            file.Delete();
        }

        public class FileInformation
        {
            public int Id { get; set; }
            public string Name { get; set; }
            public string FullPath { get; set; }
            public int EmployeeId { get; set; }
            public string FileType { get; set; }
            public int RecordId { get; set; }
        }

        public class FileBrowserEntry
        {
            public string Name { get; set; }
            public EntryType Type { get; set; }
            public long Size { get; set; }
        }

        public enum EntryType
        {
            File = 0,
            Directory
        }
    }
}