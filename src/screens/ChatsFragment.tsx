import { Avatar, Badge, IconButton, Typography } from "@mui/material";
import { GlobalConstants } from "../constants/GlobalConstants.ts";
import LogoutIcon from "@mui/icons-material/Logout";

export const ChatsFragment = () => {
  return (
    <div className={"bg-slate-900/90 h-screen flex flex-col"}>
      <div className={"h-14 m-4 flex flex-row"}>
        <div className={"flex flex-col justify-center"}>
          <Typography className={"select-none"} color={"white"} variant={"h4"}>
            {GlobalConstants.APP_NAME}
          </Typography>
        </div>
        <div className={"flex-1"} />
        <div className={"flex flex-col justify-center"}>
          <IconButton>
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              badgeContent={
                <div className={"w-3 h-3 bg-green-500 rounded-full"} />
              }
            >
              <Avatar />
            </Badge>
          </IconButton>
        </div>
        <div className={"flex flex-col justify-center"}>
          <IconButton>
            <LogoutIcon className={"text-white"} />
          </IconButton>
        </div>
      </div>
      {/*search field*/}
      <div>
        <div className={"mx-4 flex"}>
          <input
            className={"flex-1 bg-slate-600 rounded-md h-10 px-4 py-2"}
            style={{
              backgroundColor: "#1e2a31",
              border: "none",
              color: "white",
            }}
            type="text"
            placeholder="Search"
            // value={searchTerm}
            // onChange={handleSearch}
          />
        </div>
      </div>

      {/*Fav chats list*/}
      <div>
        <div className={"flex flex-col"}>
          <div className={"flex flex-row m-4"}>
            <Typography
              className={"select-none"}
              color={"white"}
              variant={"h6"}
            >
              Favourites
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
};
