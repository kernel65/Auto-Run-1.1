using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;


namespace Auto_Run_1._1
{
    class FileManager
    {
        public static String FILE_CURR_POS = Environment.GetEnvironmentVariable("USERPROFILE") +
                                    @"\Documents\OverwolfAutopath\position.pos";

        public static String FILE_STREAM = Environment.GetEnvironmentVariable("USERPROFILE") +
                            @"\Documents\OverwolfAutopath\stream.pos";

        public static String SCREEN = @"Images\Screen\screen.png";

        public static String HEEL_SCREEN = @"Images\Screen\heel.png";

        public static String HEEL_TEMPLATE = @"Images\Templates\template_heal.png";

        public static String[] TEMPLATES =
        {
            @"Images\Templates\template_blightcrag.png",
            @"Images\Templates\template_blightroot.png",
            @"Images\Templates\template_boulder.png",
            @"Images\Templates\template_bulrush.png",
            @"Images\Templates\template_bumbleblossom.png",
            @"Images\Templates\template_bush.png",
            @"Images\Templates\template_carrots.png",
            @"Images\Templates\template_dragonglory.png",
            @"Images\Templates\template_earth_mote.png",
            @"Images\Templates\template_earthcribe.png",
            @"Images\Templates\template_earthspine.png",
            @"Images\Templates\template_flint.png",
            @"Images\Templates\template_fronded_petalcap.png",
            @"Images\Templates\template_gold.png",
            @"Images\Templates\template_hemp.png",
            @"Images\Templates\template_herbs.png",
            @"Images\Templates\template_iron_vein.png",
            @"Images\Templates\template_lifebloom.png",
            @"Images\Templates\template_lighteeng_bee.png",
            @"Images\Templates\template_lodestone.png",
            @"Images\Templates\template_mature_tree.png",
            @"Images\Templates\template_orichalcum_vein.png",
            @"Images\Templates\template_platinum.png",
            @"Images\Templates\template_provisions_crate.png",
            @"Images\Templates\template_rivercress.png",
            @"Images\Templates\template_seeping_stone.png",
            @"Images\Templates\template_shockbulb.png",
            @"Images\Templates\template_silkweed.png",
            @"Images\Templates\template_silver.png",
            @"Images\Templates\template_soul_mote.png",
            @"Images\Templates\template_soulspire.png",
            @"Images\Templates\template_soulsprout.png",
            @"Images\Templates\template_soulwyrm.png",
            @"Images\Templates\template_suncreeper.png",
            @"Images\Templates\template_supply_crate.png",
            @"Images\Templates\template_young_tree.png",
        };

        public static Player.PlayerData[] ReadAndParsePos()
        {
             
            List<Player.PlayerData> tempData = new List<Player.PlayerData>();

            foreach(String line in File.ReadLines(FILE_STREAM))
            {
                if(line.Length > 0)
                {
                    Vector3 tempPos = new Vector3(-1, -1, -1);
                    double rotation = -1.0;
                    String tempFarm = null;

                    string[] points = line.Trim().Split(";");
                    for(int i = 0; i<points.Length; i++)
                    {
                        switch (i)
                        {
                            case 0:
                                tempPos.X = double.Parse(points[i].Trim());
                                break;
                            case 1:
                                tempPos.Y = double.Parse(points[i].Trim());
                                break;
                            case 2:
                                tempPos.Z = double.Parse(points[i].Trim());
                                break;
                            case 3:
                                tempFarm = points[i].Trim();
                                break;
                        }
                            
                    }

                    tempData.Add(new Player.PlayerData(tempPos, rotation, tempFarm));
                }
            }

            return tempData.ToArray();
        }


        public static void WriteInFile(List<Player.PlayerData> data)
        {
            List<String> lines = new List<string>();

            foreach(Player.PlayerData dataItem in data)
            {
                String position = dataItem.Point.X + ";" + dataItem.Point.Y + ";" + dataItem.Point.Z;                

                if(dataItem.FarmPoint != null)
                {
                    lines.Add(position + ";" + dataItem.FarmPoint);
                }
                else
                {
                    lines.Add(position);
                }

            }
            
            if(lines.Count > 0)
            {
                File.Delete(FILE_STREAM);
                File.AppendAllLines(FILE_STREAM, lines);
            }
            else
            {
                Console.WriteLine("Lines is Empty in FileManager.WriteInFile");
            }

        }

        public static void WriteInFile(List<String> lines)
        {
            if(lines.Count > 0)
            {
                File.Delete(FILE_STREAM);
                File.AppendAllLines(FILE_STREAM, lines);
           
            }
            else
            {
                Console.WriteLine("Lines is Empty in FileManager.WriteInFile");
            }
        }


        public static Player.Coordinates GetDataFromFile()
        {

            Player.Coordinates coord = new Player.Coordinates();

            try
            {
                String line = File.ReadAllText(FILE_CURR_POS);

                if (line.Contains("canread"))
                {
                    String endStr = "";
                    String[] tempStr = line.Trim().Split(';');

                    for (int i = 0; i < tempStr.Length - 1; i++)
                    {
                        switch (i)
                        {
                            case 0:
                                coord.X = double.Parse(tempStr[i], CultureInfo.InvariantCulture);
                                break;
                            case 1:
                                coord.Y = double.Parse(tempStr[i], CultureInfo.InvariantCulture);
                                break;
                            case 2:
                                coord.Z = double.Parse(tempStr[i], CultureInfo.InvariantCulture);
                                break;
                            case 3:
                                coord.Rotation = double.Parse(tempStr[i], CultureInfo.InvariantCulture);
                                break;

                        }

                        endStr += tempStr[i] + ";";
                    }

                    endStr += "canwrite";
                    File.WriteAllText(FILE_CURR_POS, endStr);
                }
            }
            catch (Exception e)
            {
                return new Player.Coordinates(-1, -1, -1, -1);
            }

            return coord;
        }
    }
}
