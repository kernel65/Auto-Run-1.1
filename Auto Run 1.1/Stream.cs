using System;
using System.Collections.Generic;
using System.Threading;
using Emgu.CV;
using Emgu.CV.Structure;
using System.Drawing;


namespace Auto_Run_1._1
{
    internal class Stream
    {
        public static bool isStreamRunning = false;
        public static bool IsPressedE = false;
        public static bool IsPressedR = false;
        public static List<Player.PlayerData> positions;     
        public Thread startStream;
        private GrabImage grabImage;
        private Image<Bgr, byte>[] templates;
        private GrabImage.RECT winCoordinates;


        public Stream()
        {
            startStream = new Thread(RunStream);
            positions = new List<Player.PlayerData>();
            grabImage = new GrabImage();
            winCoordinates = grabImage.GetWinCoordinates(Window.ProgramName);
        }



        public void RunStream()
        {

            Player.Coordinates currPos = FileManager.GetDataFromFile();
            Vector3 vCurr = new Vector3(currPos.X, currPos.Y, currPos.Z);
            Vector3 vPrev = vCurr;

            while (isStreamRunning)
            {

                currPos = FileManager.GetDataFromFile();
                vCurr = new Vector3(currPos.X, currPos.Y, currPos.Z);
                double lenght = Vector3.GetLenght(vCurr - vPrev);

                if (IsPressedR)
                {
                    Console.WriteLine("Jump point!!! " + vCurr.X + "   " + vCurr.Y + "   " + vCurr.Z + "  added");
                    positions.Add(new Player.PlayerData(vCurr, currPos.Rotation, "Jump"));
                    vPrev = vCurr;
                    IsPressedR = false;
                    lenght = 0.0;
                }

                if (IsPressedE)
                {
                    Console.WriteLine("Farm point " + vCurr.X + "    " + vCurr.Y + "  added");
                    positions.Add(new Player.PlayerData(vCurr, currPos.Rotation, "FarmPoint"));
                    vPrev = vCurr;
                    IsPressedE = false;
                    lenght = 0.0;
                }

                if (lenght >= 7.0)
                {
                    Console.WriteLine("Point " + vCurr.X + "   " + vCurr.Y + "  added");
                    positions.Add(new Player.PlayerData(vCurr));
                    vPrev = vCurr;
                }

                FileManager.GetDataFromFile();
                Thread.Sleep(80);
            }

            FileManager.WriteInFile(positions);
        }
    
        private void RunDetectTemplate()
        {
            grabImage.MakeScreenShot(FileManager.SCREEN, winCoordinates, Window.WindowWidth, Window.WindowHeight);
            Image<Bgr, byte> img = new Image<Bgr, byte>(FileManager.SCREEN);
            int detectedTemplate = -1;

            for(int i = 0; i < templates.Length; i++)
            {
                using (Image<Gray, float> result = img.MatchTemplate(templates[i], Emgu.CV.CvEnum.TemplateMatchingType.CcoeffNormed))
                {

                    double[] minValues, maxValues;
                    Point[] minLocations, maxLocations;
                    result.MinMax(out minValues, out maxValues, out minLocations, out maxLocations);

                    if (maxValues[0] > 0.7)
                    {
                        detectedTemplate = i;
                        break;
                    }
                }
            }
        
            
            if(detectedTemplate >= 0)
            {
                for(int i = 0; i < positions.Count; i++)
                {
                    if(positions[i].FarmPoint == "reserved")
                    {
                        Vector3 pos = positions[i].Point;
                        double rotation = positions[i].Rotation;                       
                        positions[i] = new Player.PlayerData(pos, rotation, FileManager.TEMPLATES[detectedTemplate]);
                    }
                }
            }
            else
            {
                for (int i = 0; i < positions.Count; i++)
                {
                    if (positions[i].FarmPoint == "reserved")
                    {
                        Vector3 pos = positions[i].Point;
                        double rotation = positions[i].Rotation;
                        positions[i] = new Player.PlayerData(pos, rotation, null);
                    }
                }
            }
        
        }


        private Image<Bgr, byte>[] IniAllTemplates()
        {
            Image<Bgr, byte>[] imgs = new Image<Bgr, byte>[FileManager.TEMPLATES.Length];

            for (int i = 0; i < FileManager.TEMPLATES.Length; i++)
            {
                imgs[i] = new Image<Bgr, byte>(FileManager.TEMPLATES[i]);
            }

            return imgs;
        }
    }
}
