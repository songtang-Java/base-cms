// // 专门用来配置Passport  验证jwt   配置的话，搜索passport-jwt
const JwtStrategy = require("passport-jwt/lib").Strategy,
     ExtractJwt = require("passport-jwt/lib").ExtractJwt;

const mongoose = require("mongoose");
const adminUser = mongoose.model("admin_user");
const keys = require("./jwtAuth");

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

// 导出一个函数
module.exports = passport => {
    passport.use(new JwtStrategy(opts, function(jwt_payload, done){
        // console.log(jwt_payload);  // 保存了解析后的用户信息
        adminUser.findOne({_id: jwt_payload.userId}).then(user => {
            if(user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        }).catch(err => console.log(err));
    }));
};
