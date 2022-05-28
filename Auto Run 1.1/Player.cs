using System;
using System.Collections.Generic;
using WindowsInput.Native;
using System.Threading;
using Emgu.CV;
using Emgu.CV.Structure;
using System.Drawing;

namespace Auto_Run_1._1
{
    class Player
    {
        public Thread startBot;
        public Thread healStream;
        public static bool isRun = false;
        public PlayerData[] points;
        private int pointWhenStart;
        private Window window;
        private GrabImage grabImage;
        private Image<Bgr, byte>[] templates;
        private GrabImage.RECT winCoordinates;
        

        public Player(List<int> checkedTemplates)
        {          
            startBot = new Thread(RunBot);
            healStream = new Thread(RunHeal);
            window = new Window();
            grabImage = new GrabImage();
            winCoordinates = grabImage.GetWinCoordinates(Window.ProgramName);
            templates = IniAllTemplates(checkedTemplates);
            points = FileManager.ReadAndParsePos();
            FileManager.GetDataFromFile();
            Thread.Sleep(100);
            pointWhenStart = GetNearPoint(points, FileManager.GetDataFromFile());
        }

        public struct PlayerData
        {
            public PlayerData(Vector3 point, double rotation, String farmPoint)
            {
                Point = point;
                Rotation = rotation;
                FarmPoint = farmPoint;
            }

            public PlayerData(Vector3 point)
            {
                Point = point;
                Rotation = -1;
                FarmPoint = null;
            }

            public Vector3 Point { get; set; }
            public double Rotation { get; set; }
            public String FarmPoint { get; set; }

        }

        public struct Coordinates
        {
            public Coordinates(double x, double y, double z, double rotation)
            {
                X = x;
                Y = y;
                Z = z;
                Rotation = rotation;
            }

            public double X { get; set; }
            public double Y { get; set; }
            public double Z { get; set; }
            public double Rotation { get; set; }


            public override string ToString()
            {
                return X + " " + Y + " " + Z + " rot = " + Rotation;
            }
        }

        public void RunHeal()
        {
            while (isRun)
            {
                GrabImage.RECT rect = grabImage.GetWinCoordinates(Window.ProgramName);
                Image<Bgr, byte> template = new Image<Bgr, byte>(FileManager.HEEL_TEMPLATE);

                int x = (rect.Left + 679) - 5;
                int y = (rect.Top + 956) - 5;
                GrabImage.RECT frameWindow = new GrabImage.RECT(x, y, 50, 50);

                grabImage.MakeScreenShot(FileManager.HEEL_SCREEN, frameWindow, template.Width + 10, template.Height + 10);
                Image<Bgr, byte> img = new Image<Bgr, byte>(FileManager.HEEL_SCREEN);

                using (Image<Gray, float> result = img.MatchTemplate(template, Emgu.CV.CvEnum.TemplateMatchingType.CcoeffNormed))
                {

                    double[] minValues, maxValues;
                    Point[] minLocations, maxLocations;
                    result.MinMax(out minValues, out maxValues, out minLocations, out maxLocations);

                    if (maxValues[0] > 0.75)
                    {
                        CommandControl.PressKey(CommandControl.B_3);
                        Thread.Sleep(20000);
                    }
                }

                Thread.Sleep(300);
            }
            
        }

        public void RunBot()
        {
            Console.WriteLine("Wait 5 seconds");
            Thread.Sleep(5000);
            Console.WriteLine(GetDate() + "Bot is running");
            
            Coordinates currPlayerData = FileManager.GetDataFromFile();           
            CommandControl.PressKeyDown(CommandControl.W);          
            bool isPressedSlow = false;
            Console.WriteLine("Near Point = " + pointWhenStart);

            while (isRun)
            {
                for (int currPoint = pointWhenStart; currPoint < points.Length && isRun; currPoint++)
                {

                    Console.WriteLine(GetDate() + "Current point = " + currPoint);
                    Vector3 target = points[currPoint].Point;
                    String CommandPoint = points[currPoint].FarmPoint;
                    currPlayerData = FileManager.GetDataFromFile();
                    int countStuck = 0;
                    
                    if(CommandPoint != "FarmPoint")
                    {
                        target.Z = 0.0;
                    }
                    else
                    {
                        if(CommandPoint == "FarmPoint")
                        {
                            Console.WriteLine(GetDate() + "Current farm point is " +
                                    target.X + " " + target.Y + " " + target.Z);
                        }

                        if(CommandPoint == "Jump")
                        {
                            Console.WriteLine(GetDate() + "Current JUMP!!! point is " +
                                    target.X + " " + target.Y + " " + target.Z);
                        }
                    }

                    if (target.X <= 0 && target.Y <= 0)
                    {
                        continue;
                    }

                    while (currPlayerData.X <= 0 && currPlayerData.Y <= 0)
                    {
                        currPlayerData = FileManager.GetDataFromFile();
                    }

                    double startLength = CommandPoint == "FarmPoint" ?
                        Vector3.GetLenght(target - new Vector3(currPlayerData.X, currPlayerData.Y, currPlayerData.Z)) :
                        Vector3.GetLenght(target - new Vector3(currPlayerData.X, currPlayerData.Y, 0.0));
                    long startTime = DateTime.Now.Ticks / TimeSpan.TicksPerMillisecond;

                    while (isRun)
                    {

                        currPlayerData = FileManager.GetDataFromFile();
                        Vector3 player = CommandPoint == "FarmPoint" ?
                            new Vector3(currPlayerData.X, currPlayerData.Y, currPlayerData.Z) :
                            new Vector3(currPlayerData.X, currPlayerData.Y, 0.0);
                        double length = Vector3.GetLenght(target - player);

                        long currTime = DateTime.Now.Ticks / TimeSpan.TicksPerMillisecond;

                        if ((currTime - startTime) > 5000)
                        {
                            //Проверяем застрял ли персонаж, путем сравнения длины вектора
                            startLength = startLength - length;
                            Console.WriteLine("Lenght = " + (startLength - length));
                            countStuck++;

                            if ((startLength - length) < 0.7)
                            {

                                Console.WriteLine(GetDate() + "Character stuck?");
                                //Вероятно персонаж застрял
                                VirtualKeyCode directionKey = CommandControl.MoveLeft;
                                if (new Random().Next(0, 2) > 0)
                                {
                                    directionKey = CommandControl.MoveRight;
                                }
                                CommandControl.PressKeyUp(CommandControl.SlowMove);
                                isPressedSlow = false;
                                Thread.Sleep(10);
                                CommandControl.PressKeyDown(CommandControl.Back);
                                Thread.Sleep(100);
                                CommandControl.PressKeyUp(CommandControl.Back);
                                Thread.Sleep(10);
                                CommandControl.PressKeyDown(directionKey);                               
                                Thread.Sleep(500);
                                CommandControl.PressKeyUp(directionKey);                             
                                Thread.Sleep(10);
                                CommandControl.PressKeyDown(VirtualKeyCode.VK_W);
                                Thread.Sleep(100);
                                CommandControl.PressKeyUp(VirtualKeyCode.VK_W);
                                Thread.Sleep(10);
                                CommandControl.PressKeyDown(CommandControl.W);

                                if (countStuck >= 2)
                                {
                                    Console.WriteLine(GetDate() + "Character stuck? Jump!");
                                    CommandControl.PressKeyUp(CommandControl.SlowMove);
                                    Thread.Sleep(10);
                                    CommandControl.PressKeyDown(CommandControl.Jump);
                                    Thread.Sleep(30);
                                    CommandControl.PressKeyUp(CommandControl.Jump);
                                }
                                
                                //Возвращаем персонажа на предыдущую точку
                                if(countStuck >= 10)
                                {
                                    Console.WriteLine(GetDate() + "It took a long time, we try the prev point");
                                    currPoint -= 2;                                 
                                    break;
                                }

                                startLength = length;
                            }

                            startTime = DateTime.Now.Ticks / TimeSpan.TicksPerMillisecond;
                        }

                        if (CommandPoint == "FarmPoint")
                        {
                            if (length <= 0.7)
                            {
                                
                                Console.WriteLine(GetDate() + "Farm point, trying to farm");
                                CommandControl.PressKeyUp(CommandControl.W);


                                double targetRot = Navigation.GetAngleToTarget(new Vector2(currPlayerData.X, currPlayerData.Y), 
                                                                                new Vector2(target.X, target.Y), currPlayerData.Rotation);
                                double differ = Navigation.AngleDifference(targetRot, currPlayerData.Rotation);


                                if (differ != 0)
                                {
                                    try
                                    {
                                        CommandControl.MoveMouse(Convert.ToInt32(differ) * 100);
                                    }
                                    catch (Exception e)
                                    {
                                        Console.WriteLine("Exception in runBot -> differ = " + differ);
                                    }
                                }


                                Thread.Sleep(1);
                                CommandControl.PressKeyUp(CommandControl.SlowMove);
                                Thread.Sleep(150);

                                Image<Bgr, byte> template;
                                Point[] tPoint = GetTemplatePoint(out template, 0.63);

                                if (tPoint != null)
                                {
                                    CommandControl.PressKey(CommandControl.Farm);
                                    Thread.Sleep(200);
                                    CommandControl.PressKey(CommandControl.Farm);
                                    Thread.Sleep(1000);

                                    //Вызываем 2-й раз из-за смещения персонажа
                                    tPoint = GetTemplatePoint(out template, 0.63);
                                    Thread.Sleep(100);
                                    //OpenCV проверяем текущую точку
                                    CheckTemplate(template, tPoint);
                                }
                                else
                                {
                                    Console.WriteLine("Farm point is empty, go to next point");
                                }

                                CommandControl.PressKeyDown(CommandControl.W);
                                isPressedSlow = false;
                                break;
                            }

                            if (length < 4.5 && !isPressedSlow)
                            {
                                CommandControl.PressKeyDown(CommandControl.SlowMove);
                                isPressedSlow = true;
                            }
                        }
                        else
                        {
                            if (length < 2.0)
                            {
                                break;
                            }
                        }

                        double targetAngle = Navigation.GetAngleToTarget(new Vector2(currPlayerData.X, currPlayerData.Y), 
                                                                            new Vector2(target.X, target.Y), currPlayerData.Rotation);
                        double diff = Navigation.AngleDifference(targetAngle, currPlayerData.Rotation);

                        if (diff != 0)
                        {
                            try
                            {
                                CommandControl.MoveMouse(Convert.ToInt32(diff) * 15);
                            }
                            catch (Exception e)
                            {
                                Console.WriteLine("Exception in runBot -> differ = " + diff);
                            }                          
                        }

                        Thread.Sleep(60);
                    }

                }
                if (isRun)
                {
                    pointWhenStart = 0;
                    RepairAll();
                }

            }

            CommandControl.PressKeyUp(CommandControl.W);
        }

        public void RepairAll()
        {
            Console.WriteLine(GetDate() + "Repair all farm items");
            GrabImage.RECT coord = grabImage.GetWinCoordinates(Window.ProgramName);
            int x = coord.Left;
            int y = coord.Top;

            Thread.Sleep(2000);

            CommandControl.PressKey(CommandControl.Tab);
            Thread.Sleep(200);
            Repair(x, y, 540, 740);
            Repair(x, y, 538, 784);
            Repair(x, y, 580, 783);
            Repair(x, y, 540, 826);
            CommandControl.PressKey(CommandControl.Tab);
            Thread.Sleep(500);
        }

        private void Repair(int x, int y, int offsetX, int offsetY)
        {
            CommandControl.SetCursor(x + offsetX, y + offsetY);
            Thread.Sleep(100);
            CommandControl.PressKeyDown(CommandControl.R);
            Thread.Sleep(500);
            CommandControl.PressKeyMouse();
            Thread.Sleep(100);
            CommandControl.PressKey(CommandControl.E);
            Thread.Sleep(10);
            CommandControl.PressKeyUp(CommandControl.R);
            Thread.Sleep(1000);
        }

        public void CheckTemplate(Image<Bgr, byte> template, Point[] templatePoint)
        {
            long startTime = DateTime.Now.Ticks / TimeSpan.TicksPerMillisecond;

            while (IsCorrectFarmPoint(template, templatePoint, 0.35))
            {
                CommandControl.PressKey(CommandControl.Farm);
                Thread.Sleep(400);               
                long currTime = DateTime.Now.Ticks / TimeSpan.TicksPerMillisecond;

                //Прошло больше времени, выходим из цикла
                if ((currTime - startTime) >= 33000)
                {
                    Console.WriteLine(GetDate() + "A lot of time has passed in CheckTemplate, going to next point");
                    Console.WriteLine("Time = " + (currTime - startTime));
                    return;
                }

            }

            Console.WriteLine("Can't find point");
        }

        public String GetDate()
        {
            String hours = DateTime.Now.Hour.ToString();
            String minutes = DateTime.Now.Minute.ToString();
            String seconds = DateTime.Now.Second.ToString();

            return "[" + hours + ":" + minutes + ":" + seconds + "]";
        }

        private Image<Bgr, byte>[] IniAllTemplates(List<int> templatesIndex)
        {
          
            Image<Bgr, byte>[] imgs = new Image<Bgr, byte>[templatesIndex.Count];

            for (int i = 0; i < templatesIndex.Count; i++)
            {
                Console.WriteLine("Template " + i + " " + FileManager.TEMPLATES[templatesIndex[i]]);
                imgs[i] = new Image<Bgr, byte>(FileManager.TEMPLATES[templatesIndex[i]]);
            }

            return imgs;
        }

        private bool IsCorrectFarmPoint(Image<Bgr, byte> template, Point[] templPoint, double detectProcent)
        {
            //Расширить прямоугольник, из-за смещения персонажа во время позиционирования
            if(templPoint != null)
            {
                int x = winCoordinates.Left + (templPoint[0].X - 65);
                int y = winCoordinates.Top + (templPoint[0].Y - 65);
                GrabImage.RECT frameWindow = new GrabImage.RECT(x, y, 340, template[0].Height * 10);

                grabImage.MakeScreenShot(FileManager.SCREEN, frameWindow, frameWindow.Right, frameWindow.Bottom);
                Image<Bgr, byte> img = new Image<Bgr, byte>(FileManager.SCREEN);

                using (Image<Gray, float> result = img.MatchTemplate(template, Emgu.CV.CvEnum.TemplateMatchingType.CcoeffNormed))
                {
                    double[] minValues, maxValues;
                    Point[] minLocations, maxLocations;
                    result.MinMax(out minValues, out maxValues, out minLocations, out maxLocations);

                    if (maxValues[0] > detectProcent)
                    {
                        return true;
                    }
                }
            }     
           
            return false;
        }

        private Point[] GetTemplatePoint(out Image<Bgr, byte> template, double detectProcent)
        {
            grabImage.MakeScreenShot(FileManager.SCREEN, winCoordinates, Window.WindowWidth, Window.WindowHeight);
            Image<Bgr, byte> img = new Image<Bgr, byte>(FileManager.SCREEN);

            foreach(Image<Bgr, byte> templ in templates)
            {
                using (Image<Gray, float> result = img.MatchTemplate(templ, Emgu.CV.CvEnum.TemplateMatchingType.CcoeffNormed))
                {
                    double[] minValues, maxValues;
                    Point[] minLocations, maxLocations;
                    result.MinMax(out minValues, out maxValues, out minLocations, out maxLocations);

                    if (maxValues[0] > detectProcent)
                    {
                        template = templ;
                        return maxLocations;
                    }
                }
            }
            
            template = null;
            return null;
        }

        private int GetNearPoint(PlayerData[] points, Coordinates currPlayerPos)
        {
            Vector3 playerPos = new Vector3(currPlayerPos.X, currPlayerPos.Y, currPlayerPos.Z);
            double nearLength = 0;
            int resultIndex = 0;

            for(int i = 0; i < points.Length; i++)
            {
                Vector3 point = points[i].Point;
                double result = Vector3.GetLenght(point - playerPos);

                if (i == 0)
                {
                    nearLength = result;
                }
                else if (result < nearLength)
                {
                    nearLength = result;
                    resultIndex = i;
                }
            }

            return resultIndex;
        }
    }
}
